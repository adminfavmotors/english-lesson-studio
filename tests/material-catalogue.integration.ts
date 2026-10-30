import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { testDatabase } from './helpers/test-database.ts';
import { readMaterialDocument } from '../src/material-model.ts';
import { materialPracticeKey, restoreMaterialDraft } from '../src/material-practice.ts';
import type { MaterialDocument } from '../src/material-model.ts';

test('catalogue migration preserves published lessons, private imports, favourites and existing draft keys', async () => {
  const documents: MaterialDocument[] = JSON.parse(fs.readFileSync(new URL('../src/data/a1-lessons.json', import.meta.url), 'utf8'));
  const versions: Record<string, number> = JSON.parse(fs.readFileSync(new URL('../src/data/a1-versions.json', import.meta.url), 'utf8'));
  const legacy = JSON.parse(fs.readFileSync(new URL('./fixtures/material-v1.json', import.meta.url), 'utf8'));
  const review = JSON.parse(fs.readFileSync(new URL('../docs/a1-classification-review.json', import.meta.url), 'utf8'));
  const owner = 'f0000000-0000-4000-8000-000000000001';
  let before: Record<string, unknown>[] = [];
  const storage = new Map<string, string>();
  const db = await testDatabase({
    seedLibrary: false,
    throughMigration: '20261029204914_separate_material_catalogue.sql',
    beforeMigration: async (db, name) => {
      if (!name.endsWith('_separate_material_catalogue.sql')) return;
      await db.query("insert into auth.users(id,email,email_confirmed_at) values($1,'migration-qa@example.invalid',now())", [owner]);
      for (const {catalogue, content} of documents) {
        const id = `a1-${String(catalogue.sequence).padStart(2, '0')}`;
        const previousCatalogue = Object.fromEntries(['title','subtitle','level','topic','duration','sequence'].map(key => [key, catalogue[key as keyof typeof catalogue]]));
        const oldContent = {...previousCatalogue, skills: review.reviews[catalogue.sequence! - 1].source.legacy_skills, ...content, schemaVersion: 1};
        await db.query(`insert into public.lesson_materials(id,owner_id,content,version,created_at,updated_at)
          values($1,null,$2,$3,'2026-10-01T10:00:00Z','2026-10-02T10:00:00Z')`, [id, JSON.stringify(oldContent), versions[id]]);
      }
      await db.query(`insert into public.lesson_materials(id,owner_id,content,version,created_at,updated_at)
        values('custom-migration-qa',$1,$2,9,'2026-10-01T10:00:00Z','2026-10-02T10:00:00Z')`, [owner, JSON.stringify({...legacy, title: 'Private migration lesson', sequence: null})]);
      await db.query("insert into public.material_favourites(owner_id,material_id) values($1,'a1-14'),($1,'custom-migration-qa')", [owner]);
      before = (await db.query<Record<string, unknown>>('select * from public.lesson_materials order by id')).rows;
      for (const row of before) storage.set(materialPracticeKey(String(row.id), Number(row.version), false), JSON.stringify({
        answers: {'understand.1': 'Original answer'}, writing: 'My own text — Олена', homework: 'Keep my homework',
      }));
    },
  });
  try {
    assert.equal(before.length, 31, 'The upgrade must actually migrate populated schema-1 rows');
    const after = (await db.query<Record<string, unknown>>('select * from public.lesson_materials order by id')).rows;
    for (const [index, row] of after.entries()) {
      const converted = readMaterialDocument(before[index].content);
      assert.ok(converted.document);
      assert.deepEqual(row, {...before[index], content: converted.document.content, catalogue_version: 1});
      const draft = restoreMaterialDraft(key => storage.get(key) ?? null, String(row.id), Number(row.version), false);
      assert.equal(draft.answers['understand.1'], 'Original answer');
      assert.equal(draft.writing, 'My own text — Олена');
      assert.equal(draft.homework, 'Keep my homework');
    }
    assert.equal((await db.query('select * from public.material_favourites')).rows.length, 2);

    await db.exec("update public.lesson_materials set topic='Reclassified topic' where id='a1-14'");
    const edited = (await db.query<Record<string, unknown>>("select * from public.lesson_materials where id='a1-14'")).rows[0];
    assert.equal(edited.version, versions['a1-14']);
    assert.equal(edited.catalogue_version, 2);
    assert.equal(restoreMaterialDraft(key => storage.get(key) ?? null, 'a1-14', Number(edited.version), false).writing, 'My own text — Олена');

  } finally { await db.close(); }
});
