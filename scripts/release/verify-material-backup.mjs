// Offline only: the database is in-memory PGlite, with a synthetic Auth surface.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {testDatabase} from '../../tests/helpers/test-database.ts';

const file=process.argv[2];
if(!file)throw new Error('Provide the path to the pre-release material snapshot.');
const bytes=fs.readFileSync(file);
const backup=JSON.parse(bytes.toString('utf8'));
assert.ok(Array.isArray(backup.materials)&&Array.isArray(backup.favourites)&&Array.isArray(backup.history));
assert.equal(backup.history.length,9,'This verifier targets the recorded pre-catalogue release.');
const db=await testDatabase({seedLibrary:false,throughMigration:'20261027205743_student_account_invitations.sql'});
try {
  const owners=new Set([...backup.materials.map(r=>r.owner_id),...backup.favourites.map(r=>r.owner_id)].filter(Boolean));
  for(const id of owners)await db.query('insert into auth.users(id,email_confirmed_at) values($1,now())',[id]);
  for(const row of backup.materials) {
    assert.equal(row.content.schemaVersion,1);
    await db.query('insert into public.lesson_materials(id,owner_id,content,version,created_at,updated_at) values($1,$2,$3,$4,$5,$6)',
      [row.id,row.owner_id,JSON.stringify(row.content),row.version,row.created_at,row.updated_at]);
  }
  for(const row of backup.favourites)await db.query('insert into public.material_favourites(owner_id,material_id,created_at) values($1,$2,$3)',[row.owner_id,row.material_id,row.created_at]);
  await db.exec('create schema supabase_migrations;create table supabase_migrations.schema_migrations(version text primary key,name text)');
  for(const row of backup.history)await db.query('insert into supabase_migrations.schema_migrations values($1,$2)',[row.version,row.name]);
  const schema=async()=> (await db.query(`select a.attname,a.attgenerated,a.attnotnull,pg_get_expr(d.adbin,d.adrelid) expression
    from pg_attribute a left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
    where a.attrelid='public.lesson_materials'::regclass and a.attnum>0 and not a.attisdropped order by a.attname`)).rows;
  const oldSchema=await schema();
  const favourites=(await db.query('select * from public.material_favourites order by owner_id,material_id')).rows;
  const migrations=['20261029204914_separate_material_catalogue.sql','20261030180952_separate_material_facets.sql'];
  for(const [i,name] of migrations.entries()) {
    await db.exec(fs.readFileSync(new URL('../../supabase/migrations/'+name,import.meta.url),'utf8'));
    await db.query('insert into supabase_migrations.schema_migrations values($1,$2)',[`2099010100000${i+1}`,name.slice(15,-4)]);
  }
  const before=(await db.query('select * from public.lesson_materials order by id')).rows;
  const recoveryFile=new URL('./restore-material-catalogue.sql',import.meta.url);
  const recovery=fs.readFileSync(recoveryFile);
  await db.exec(recovery.toString('utf8'));
  assert.deepEqual(await schema(),oldSchema);
  const restored=(await db.query('select * from public.lesson_materials order by id')).rows;
  assert.equal(restored.length,before.length);
  for(const [index,row] of restored.entries()) {
    for(const key of ['id','owner_id','version','created_at','updated_at','title','subtitle','level','topic','duration','sequence'])assert.deepEqual(row[key],before[index][key],`${row.id}: ${key}`);
    const body={...row.content,schemaVersion:2};
    for(const key of ['title','subtitle','level','topic','skills','duration','sequence'])delete body[key];
    assert.deepEqual(body,before[index].content);
  }
  assert.deepEqual((await db.query('select * from public.material_favourites order by owner_id,material_id')).rows,favourites);
  assert.equal((await db.query('select * from supabase_migrations.schema_migrations')).rows.length,9);
  const report=JSON.stringify({result:'PASS',offline:true,materials:restored.length,favourites:favourites.length,
    baseline_migrations:backup.history.length,forward_migrations:2,generated_schema_restored:true,current_data_preserved:true,
    backup_sha256:createHash('sha256').update(bytes).digest('hex'),
    recovery_sql_sha256:createHash('sha256').update(recovery).digest('hex')},null,2);
  if(process.argv[3]) {
    assert.notEqual(path.resolve(process.argv[3]),path.resolve(file),'A report must not overwrite its snapshot.');
    fs.writeFileSync(process.argv[3],report+'\n',{flag:'wx'});
  }
  console.log(report);
} finally {await db.close();}
