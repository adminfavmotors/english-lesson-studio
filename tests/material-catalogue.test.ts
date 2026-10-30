import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  MATERIAL_CATALOGUE_FIELDS, materialDocument, readMaterialDocument,
  validateMaterialCatalogue, validateMaterialContent, validateMaterialDocument,
} from '../src/material-model.ts';
import type { Material, MaterialDocument } from '../src/material-model.ts';

const legacy = JSON.parse(fs.readFileSync(new URL('./fixtures/material-v1.json', import.meta.url), 'utf8'));
const documents: MaterialDocument[] = JSON.parse(fs.readFileSync(new URL('../src/data/a1-lessons.json', import.meta.url), 'utf8'));

test('previously downloaded schema-1 lessons import without changing activities or the caller input', () => {
  const before = structuredClone(legacy);
  const {document, errors} = readMaterialDocument(legacy);
  assert.deepEqual(errors, []);
  assert.ok(document);
  assert.deepEqual(document.content, documents[0].content);
  assert.equal(document.catalogue.classification_status, 'needs_review');
  assert.equal(document.catalogue.skills, null);
  assert.equal(document.catalogue.language_focus, null);
  assert.deepEqual(document.catalogue.legacy_skills, legacy.skills);
  assert.deepEqual(legacy, before);
  const {schemaVersion: _version, ...body} = document.content;
  const catalogue = Object.fromEntries(['title','subtitle','level','topic','duration','sequence']
    .map(key => [key, document.catalogue[key as keyof typeof document.catalogue]]));
  assert.deepEqual({...catalogue, skills: document.catalogue.legacy_skills, ...body, schemaVersion: 1}, legacy);
});

test('native exports contain one catalogue description and no row identity or duplicate content metadata', () => {
  const material: Material = {
    ...documents[0].catalogue, content: documents[0].content,
    id: 'a1-01', owner_id: null, version: 4, catalogue_version: 7,
    created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-02T00:00:00Z',
  };
  const exported = materialDocument(material);
  assert.deepEqual(Object.keys(exported).sort(), ['catalogue', 'content']);
  assert.deepEqual(readMaterialDocument(JSON.parse(JSON.stringify(exported))), {document: exported, errors: []});
  for (const key of MATERIAL_CATALOGUE_FIELDS) assert.equal(Object.hasOwn(exported.content, key), false);
  assert.deepEqual(exported, documents[0]);
});

test('catalogue and teaching content validate independently and duplicated descriptions are rejected', () => {
  assert.deepEqual(validateMaterialContent(documents[0].content), []);
  assert.deepEqual(validateMaterialCatalogue(documents[0].catalogue), []);
  assert.ok(validateMaterialContent({...documents[0].content, topic: 'Wrong owner'}).length);
  assert.ok(validateMaterialContent({...documents[0].content, schemaVersion: 1}).length);
  assert.ok(validateMaterialCatalogue({...documents[0].catalogue, level: null}).length);
  assert.ok(validateMaterialDocument({catalogue: documents[0].catalogue}).length);
  assert.equal(readMaterialDocument({schemaVersion: 1, title: 'Incomplete'}).document, null);
  assert.equal(readMaterialDocument({schemaVersion: 3}).document, null);
});

test('separating the catalogue retains the compact JSON import limit', () => {
  const oversized = structuredClone(documents[0]);
  oversized.content.language.examples = Array(20).fill('x'.repeat(6000));
  assert.ok(validateMaterialDocument(oversized).some(error => error.includes('100 KB')));
  assert.equal(readMaterialDocument(oversized).document, null);
});
