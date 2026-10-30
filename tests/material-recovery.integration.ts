import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { testDatabase } from './helpers/test-database.ts';
import { materialPracticeKey, restoreMaterialDraft } from '../src/material-practice.ts';

const directory = new URL('../supabase/migrations/',import.meta.url);
const restore = fs.readFileSync(new URL('../scripts/release/restore-material-catalogue.sql',import.meta.url),'utf8');
const catalogueMigration='20261029204914_separate_material_catalogue.sql';
const classificationMigration='20261030180952_separate_material_facets.sql';
const source=JSON.parse(fs.readFileSync(new URL('../src/data/a1-lessons.json',import.meta.url),'utf8'));
const review=JSON.parse(fs.readFileSync(new URL('../docs/a1-classification-review.json',import.meta.url),'utf8'));
const baseline=[
  ['20261025145629','lesson_sessions'],['20261025150301','explicit_private_deny_policy'],
  ['20261025153544','lesson_workspace_metadata'],['20261025161256','individual_memory_practice'],
  ['20261025211851','teacher_students'],['20261025220643','assignment_library'],
  ['20261025222251','material_validation'],['20261027151758','workspace_access'],
  ['20261027205743','student_account_invitations'],
];
const owner='f4000000-0000-4000-8000-000000000001';
const describe=(db:Awaited<ReturnType<typeof testDatabase>>) => db.query(`
  select a.attname name,a.attgenerated generated,pg_get_expr(d.adbin,d.adrelid) expression,a.attnotnull required
  from pg_attribute a left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
  where a.attrelid='public.lesson_materials'::regclass and a.attnum>0 and not a.attisdropped order by a.attname`);

async function oldDatabase() {
  const db=await testDatabase({seedLibrary:false,throughMigration:'20261027205743_student_account_invitations.sql'});
  await db.exec('create schema supabase_migrations;create table supabase_migrations.schema_migrations(version text primary key,name text);');
  for(const [version,name] of baseline)await db.query('insert into supabase_migrations.schema_migrations values($1,$2)',[version,name]);
  for(let index=0;index<source.length;index++) {
    const {catalogue:c,content}=source[index],row=review.reviews[index];
    const oldCatalogue=Object.fromEntries(['title','subtitle','level','topic','duration','sequence'].map(key=>[key,c[key]]));
    const oldContent={...oldCatalogue,...content,schemaVersion:1,skills:row.source.legacy_skills};
    await db.query("insert into public.lesson_materials(id,owner_id,content,version) values($1,null,$2,$3)",
      [row.material_id,JSON.stringify(oldContent),row.source.teaching_revision]);
  }
  return db;
}

for(const both of [false,true])test(`recovery after ${both?'both migrations':'the catalogue migration'} preserves current materials, new imports, favourites, drafts and access`,async()=>{
  const db=await oldDatabase();
  try {
    const oldShape=(await describe(db)).rows;
    await db.exec(fs.readFileSync(new URL(catalogueMigration,directory),'utf8'));
    // MCP may assign timestamps different from the local migration filenames.
    await db.exec("insert into supabase_migrations.schema_migrations values('20990101000001','separate_material_catalogue')");
    if(both){await db.exec(fs.readFileSync(new URL(classificationMigration,directory),'utf8'));
      await db.exec("insert into supabase_migrations.schema_migrations values('20990101000002','separate_material_facets')");}
    await db.query("insert into auth.users(id,email,email_confirmed_at) values($1,'recovery-fixture@example.invalid',now())",[owner]);
    await db.query("update public.workspace_members set role='teacher' where user_id=$1",[owner]);
    const c=source[0].catalogue,content=source[0].content;
    if(both) {
      await db.query(`insert into public.lesson_materials(id,owner_id,title,subtitle,level,topic,duration,content,
        classification_status,skills,language_focus,legacy_skills,version)
        values('custom-recovery-reviewed',$1,'New reviewed import',$2,$3,$4,$5,$6,'reviewed','[]','["spelling_punctuation"]',null,7),
        ('custom-recovery-pending',$1,'New pending import',$2,$3,$4,$5,$6,'needs_review',null,null,'["grammar","grammar","spelling"]',9)`,
        [owner,c.subtitle,c.level,c.topic,c.duration,JSON.stringify(content)]);
    } else await db.query(`insert into public.lesson_materials(id,owner_id,title,subtitle,level,topic,duration,content,skills,version)
      values('custom-recovery-pending',$1,'New private import',$2,$3,$4,$5,$6,'["grammar","spelling"]',9)`,
      [owner,c.subtitle,c.level,c.topic,c.duration,JSON.stringify(content)]);
    await db.query("insert into public.material_favourites(owner_id,material_id) values($1,'a1-14'),($1,'custom-recovery-pending')",[owner]);
    await db.exec("update public.lesson_materials set content=jsonb_set(content,'{goal}','\"A new teaching revision after release\"'),title='Edited after release' where id='a1-14'");
    const before=(await db.query<Record<string,unknown>>('select * from public.lesson_materials order by id')).rows;
    const favourites=(await db.query('select * from public.material_favourites order by material_id')).rows;
    const storage=new Map(before.map(row=>[materialPracticeKey(String(row.id),Number(row.version),false),
      JSON.stringify({answers:{'understand.1':'Saved answer'},writing:'Keep this text — Олена',homework:'Keep homework'})]));
    await db.exec(restore);
    assert.deepEqual((await describe(db)).rows,oldShape,'The old generated columns and required fields must be restored');
    const after=(await db.query<Record<string,unknown>>('select * from public.lesson_materials order by id')).rows;
    assert.equal(after.length,before.length);
    for(const [index,row] of after.entries()) {
      const previous=before[index],flat=row.content as Record<string,unknown>;
      for(const key of ['id','owner_id','version','created_at','updated_at'])assert.deepEqual(row[key],previous[key]);
      for(const key of ['title','subtitle','level','topic','duration','sequence'])assert.deepEqual(row[key],previous[key]);
      const {schemaVersion:_version,title:_title,subtitle:_subtitle,level:_level,topic:_topic,skills:_skills,duration:_duration,sequence:_sequence,...body}=flat;
      const {schemaVersion:_schema,...previousBody}=previous.content as Record<string,unknown>;
      assert.deepEqual(body,previousBody,'Format recovery must not rewrite activities or writing');
      assert.equal(flat.schemaVersion,1);
      assert.deepEqual(row.skills,flat.skills);
      assert.equal(Object.hasOwn(row,'catalogue_version'),false);
      const draft=restoreMaterialDraft(key=>storage.get(key)??null,String(row.id),Number(row.version),false);
      assert.equal(draft.writing,'Keep this text — Олена');assert.equal(draft.homework,'Keep homework');
    }
    if(both){assert.deepEqual(after.find(r=>r.id==='custom-recovery-reviewed')!.skills,['spelling']);
      assert.deepEqual(after.find(r=>r.id==='custom-recovery-pending')!.skills,['grammar','grammar','spelling']);}
    assert.deepEqual((await db.query('select * from public.material_favourites order by material_id')).rows,favourites);
    assert.deepEqual((await db.query('select version,name from supabase_migrations.schema_migrations order by version')).rows,
      baseline.map(([version,name])=>({version,name})));
    await db.exec('set role anon');await assert.rejects(db.query('select * from public.lesson_materials'),/permission denied/);await db.exec('reset role');
    await db.exec('begin;set local role authenticated');
    await db.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:owner,role:'authenticated'})]);
    assert.equal((await db.query("select id from public.lesson_materials where id='custom-recovery-pending'")).rows.length,1);
    const privileges=(await db.query("select has_column_privilege(current_user,'public.lesson_materials','title','UPDATE') as title_update,has_column_privilege(current_user,'public.lesson_materials','content','UPDATE') as content_update")).rows[0];
    assert.equal(privileges.title_update,false);assert.equal(privileges.content_update,true);
    await db.exec("update public.lesson_materials set content=jsonb_set(content,'{goal}','\"Updated through the restored content API\"') where id='custom-recovery-pending'");
    assert.equal((await db.query("select version from public.lesson_materials where id='custom-recovery-pending'")).rows[0].version,10);
    await assert.rejects(db.query("update public.lesson_materials set title='Cannot edit a generated field' where id='custom-recovery-pending'"),/can only be updated to DEFAULT/);
    await db.exec('rollback');
  } finally {await db.close();}
});

test('recovery refuses unknown later migrations without changing data or the new schema',async()=>{
  const db=await oldDatabase();
  try {
    await db.exec(fs.readFileSync(new URL(catalogueMigration,directory),'utf8'));
    await db.exec("insert into supabase_migrations.schema_migrations values('20990101000001','separate_material_catalogue'),('20990101000003','unrelated_later_change')");
    const before=(await db.query('select * from public.lesson_materials order by id')).rows;
    await assert.rejects(db.exec(restore),/do not undo later changes/);await db.exec('rollback');
    assert.deepEqual((await db.query('select * from public.lesson_materials order by id')).rows,before);
    assert.ok((await describe(db)).rows.some(row=>row.name==='catalogue_version'));
  } finally {await db.close();}
});

test('recovery stops before a current material would exceed the old content limit',async()=>{
  const db=await oldDatabase();
  try {
    await db.exec(fs.readFileSync(new URL(catalogueMigration,directory),'utf8'));
    await db.exec("insert into supabase_migrations.schema_migrations values('20990101000001','separate_material_catalogue')");
    const size=(await db.query("select octet_length(jsonb_set(content,'{teacherNotes}','[\"\"]')::text) as bytes from public.lesson_materials where id='a1-01'")).rows[0].bytes as number;
    await db.query("update public.lesson_materials set content=jsonb_set(content,'{teacherNotes}',jsonb_build_array(repeat('x',$1))) where id='a1-01'",[149990-size]);
    const before=(await db.query("select * from public.lesson_materials where id='a1-01'")).rows[0];
    await assert.rejects(db.exec(restore),/cannot fit the old contract without loss/);await db.exec('rollback');
    assert.deepEqual((await db.query("select * from public.lesson_materials where id='a1-01'")).rows[0],before);
  } finally {await db.close();}
});
