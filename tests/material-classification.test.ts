import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { readMaterialDocument, validateMaterialCatalogue, materialDocument } from '../src/material-model.ts';
import { assertReviewedA1 } from '../scripts/a1/classification-review.mjs';
import type { Material, MaterialDocument } from '../src/material-model.ts';

const documents: MaterialDocument[] = JSON.parse(fs.readFileSync(new URL('../src/data/a1-lessons.json', import.meta.url),'utf8'));
const legacy = JSON.parse(fs.readFileSync(new URL('./fixtures/material-v2.json', import.meta.url),'utf8'));
const catalogue = documents[0].catalogue;

test('every A1 classification matches the reviewed content, catalogue and teaching revision', () => {
  assert.doesNotThrow(() => assertReviewedA1(documents));
  const changed = structuredClone(documents);
  changed[13].content.goal = 'Changed teaching goal';
  assert.throws(() => assertReviewedA1(changed), /a1-14/);
  changed[13] = structuredClone(documents[13]);
  changed[13].catalogue.skills = ['speaking'];
  assert.throws(() => assertReviewedA1(changed), /a1-14/);
});

test('skills and language focus are independent, distinct controlled sets', () => {
  for (const value of [
    {...catalogue, skills: [], language_focus: ['grammar']},
    {...catalogue, skills: ['speaking'], language_focus: []},
  ]) assert.deepEqual(validateMaterialCatalogue(value), []);
  for (const patch of [
    {skills:['grammar']}, {language_focus:['speaking']},
    {skills:['speaking','speaking']}, {language_focus:['grammar','grammar']},
    {skills:[null]}, {language_focus:['spelling']},
    {skills:[],language_focus:[]}, {legacy_skills:['grammar']},
    {classification_status:'unknown'}, {skills:null},
  ]) assert.ok(validateMaterialCatalogue({...catalogue,...patch}).length, JSON.stringify(patch));
});

test('previous separated JSON imports preserve mixed tags without claiming a reviewed classification', () => {
  const before = structuredClone(legacy);
  const result = readMaterialDocument(legacy);
  assert.deepEqual(result.errors, []);
  assert.ok(result.document);
  assert.deepEqual(result.document.content,legacy.content);
  assert.deepEqual(result.document.catalogue, {...legacy.catalogue,skills:null,language_focus:null,
    classification_status:'needs_review',legacy_skills:legacy.catalogue.skills});
  assert.deepEqual(legacy,before);
  const row = {...result.document.catalogue, content:result.document.content,id:'custom-qa',owner_id:'teacher',
    version:1,catalogue_version:1,created_at:'2026-10-30',updated_at:'2026-10-30'} as Material;
  assert.deepEqual(readMaterialDocument(materialDocument(row)).document,result.document);
});

test('unreviewed is distinct from reviewed empty facets and cannot hide malformed new classification', () => {
  const pending = {...catalogue,classification_status:'needs_review',skills:null,language_focus:null,legacy_skills:['grammar','grammar','spelling']};
  assert.deepEqual(validateMaterialCatalogue(pending), []);
  for(const patch of [{skills:[]},{language_focus:[]},{legacy_skills:[]},{legacy_skills:['other']}])
    assert.ok(validateMaterialCatalogue({...pending,...patch}).length);
  for(const patch of [{language_focus:[]},{classification_status:'reviewed'},{legacy_skills:null}])
    assert.equal(readMaterialDocument({...legacy,catalogue:{...legacy.catalogue,...patch}}).document,null);
  const flat = JSON.parse(fs.readFileSync(new URL('./fixtures/material-v1.json',import.meta.url),'utf8'));
  assert.equal(readMaterialDocument({...flat,language_focus:[]}).document,null);
});

test('classification metadata preserves a previously valid near-limit import and its new export', () => {
  const near = structuredClone(legacy);
  near.content.language.examples = ['x'];
  const size = () => new TextEncoder().encode(JSON.stringify(near)).length;
  while (100000 - size() > 6004) near.content.language.examples.push('x'.repeat(6000));
  near.content.language.examples.push('x'.repeat(100000 - size() - 4));
  assert.ok(size() <= 100000 && size() >= 99990);
  const converted = readMaterialDocument(near);
  assert.deepEqual(converted.errors, []);
  assert.ok(converted.document);
  assert.ok(new TextEncoder().encode(JSON.stringify(converted.document)).length > 100000);
  assert.deepEqual(readMaterialDocument(JSON.parse(JSON.stringify(converted.document))).errors, []);
});
