import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import type { PGlite } from '@electric-sql/pglite';
import { testDatabase } from './helpers/test-database.ts';
import { materialPracticeKey, restoreMaterialDraft } from '../src/material-practice.ts';

const documents = JSON.parse(fs.readFileSync(new URL('../src/data/a1-lessons.json',import.meta.url),'utf8'));
const review = JSON.parse(fs.readFileSync(new URL('../docs/a1-classification-review.json',import.meta.url),'utf8'));
const migration = '20261030180952_separate_material_facets.sql';
const previousMigration = '20261029204914_separate_material_catalogue.sql';
const owner = 'f2000000-0000-4000-8000-000000000001';

async function seedPrevious(db: PGlite, changed?: 'content' | 'catalogue' | 'version') {
  await db.query("insert into auth.users(id,email,email_confirmed_at) values($1,'classification-qa@example.invalid',now())",[owner]);
  for(let index=0;index<documents.length;index++) {
    const {catalogue:c,content}=structuredClone(documents[index]);
    const row=review.reviews[index];
    if(index===13 && changed==='content') content.goal='A changed activity with the same declared version';
    if(index===13 && changed==='catalogue') c.topic='Unreviewed topic';
    await db.query(`insert into public.lesson_materials(id,owner_id,title,subtitle,level,topic,skills,duration,sequence,content,version,created_at,updated_at)
      values($1,null,$2,$3,$4,$5,$6,$7,$8,$9,$10,'2026-10-01','2026-10-02')`,
      [row.material_id,c.title,c.subtitle,c.level,c.topic,JSON.stringify(row.source.legacy_skills),c.duration,c.sequence,
        JSON.stringify(content),row.source.teaching_revision+(index===13 && changed==='version'?1:0)]);
  }
  const {catalogue:c,content}=documents[0];
  for(const [id,ownerId,tags] of [['custom-unreviewed-qa',owner,['grammar','grammar','spelling']],['studio-other-qa',null,['reading','vocabulary']]] as const)
    await db.query(`insert into public.lesson_materials(id,owner_id,title,subtitle,level,topic,skills,duration,sequence,content,version,created_at,updated_at)
      values($1,$2,$3,$4,$5,$6,$7,$8,null,$9,9,'2026-10-01','2026-10-02')`,
      [id,ownerId,id,c.subtitle,c.level,c.topic,JSON.stringify(tags),c.duration,JSON.stringify(content)]);
  await db.query("insert into public.material_favourites(owner_id,material_id) values($1,'a1-14'),($1,'custom-unreviewed-qa')",[owner]);
}

test('classification migration applies only the reviewed studio mapping and preserves private data, revisions and drafts',async()=>{
  let before: Record<string,unknown>[]=[];
  const storage=new Map<string,string>();
  const db=await testDatabase({seedLibrary:false,beforeMigration:async(db,name)=>{
    if(name!==migration)return;
    await seedPrevious(db);
    before=(await db.query<Record<string,unknown>>('select * from public.lesson_materials order by id')).rows;
    for(const row of before)for(const teacher of [true,false])storage.set(materialPracticeKey(String(row.id),Number(row.version),teacher),
      JSON.stringify({answers:{'understand.1':'Keep this answer'},writing:'My own text — Олена',homework:'Keep my homework'}));
  }});
  try {
    const after=(await db.query<Record<string,unknown>>('select * from public.lesson_materials order by id')).rows;
    assert.equal(after.length,32);
    for(let index=0;index<after.length;index++){
      const row=after[index],old=before[index];
      for(const key of ['id','owner_id','title','subtitle','level','topic','duration','sequence','content','version','created_at','search_text'])
        assert.deepEqual(row[key],old[key],`${row.id}: ${key}`);
      assert.equal(row.catalogue_version,Number(old.catalogue_version)+1);
      const entry=review.reviews.find((entry:{material_id:string})=>entry.material_id===row.id);
      if(entry){assert.equal(row.classification_status,'reviewed');assert.deepEqual(row.skills,entry.proposal.skills);
        assert.deepEqual(row.language_focus,entry.proposal.language_focus);assert.equal(row.legacy_skills,null);}
      else {assert.equal(row.classification_status,'needs_review');assert.equal(row.skills,null);
        assert.equal(row.language_focus,null);assert.deepEqual(row.legacy_skills,old.skills);}
      for(const teacher of [true,false]){
        const draft=restoreMaterialDraft(key=>storage.get(key)??null,String(row.id),Number(row.version),teacher);
        assert.equal(draft.answers['understand.1'],'Keep this answer');assert.equal(draft.writing,'My own text — Олена');
        assert.equal(draft.homework,'Keep my homework');
      }
    }
    assert.equal((await db.query('select * from public.material_favourites')).rows.length,2);
    await db.exec("update public.lesson_materials set language_focus=language_focus where classification_status='reviewed'");
    assert.deepEqual((await db.query('select * from public.lesson_materials order by id')).rows,after,'A classification no-op must preserve timestamps as well as both revisions');
    const seed=execFileSync(process.execPath,['scripts/seed-library.mjs','0','30'],{encoding:'utf8'});
    await db.exec(seed);
    assert.deepEqual((await db.query('select * from public.lesson_materials order by id')).rows,after,'An unchanged reviewed seed must be a no-op');
    await db.exec(seed);
    assert.deepEqual((await db.query('select * from public.lesson_materials order by id')).rows,after);
  } finally {await db.close();}
});

for(const changed of ['content','catalogue','version'] as const)
  test(`classification migration rejects an unreviewed studio ${changed} change atomically`,async()=>{
    const db=await testDatabase({seedLibrary:false,throughMigration:previousMigration});
    try {
      await seedPrevious(db,changed);
      const before=(await db.query('select * from public.lesson_materials order by id')).rows;
      await db.exec('begin');
      await assert.rejects(db.exec(fs.readFileSync(new URL('../supabase/migrations/'+migration,import.meta.url),'utf8')),/a1-14 differs from its classification review/);
      await db.exec('rollback');
      assert.deepEqual((await db.query('select * from public.lesson_materials order by id')).rows,before);
      assert.equal((await db.query("select column_name from information_schema.columns where table_schema='public' and table_name='lesson_materials' and column_name='language_focus'")).rows.length,0);
    } finally {await db.close();}
  });
