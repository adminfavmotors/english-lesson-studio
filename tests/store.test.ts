import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDocument, mergeDocuments } from '../src/store.ts';
import { exercises, choices } from '../src/lesson.ts';

test('simultaneous edits in different tabs preserve both answers', () => {
  const a = parseDocument(JSON.stringify({version:1,fields:{'ex3.answer.1':{value:'Student text',time:10,writer:'student'}}}));
  const b = parseDocument(JSON.stringify({version:1,fields:{'ex11.answer.1.grade':{value:'correct',time:10,writer:'teacher'}}}));
  assert.deepEqual(mergeDocuments(a,b),mergeDocuments(b,a));
  assert.equal(Object.keys(mergeDocuments(a,b).fields).length,2);
});
test('newer resets prevent stale tabs from resurrecting answers', () => {
  const a = parseDocument(JSON.stringify({version:1,fields:{answer:{value:'Old answer',time:10,writer:'student'}}}));
  const b = parseDocument(JSON.stringify({version:1,fields:{answer:{value:null,time:11,writer:'teacher'}}}));
  assert.equal(mergeDocuments(a,b).fields.answer.value,null);
  assert.equal(mergeDocuments(b,a).fields.answer.value,null);
});
test('equal timestamps resolve consistently across tabs', () => {
  const a = parseDocument('{"version":1,"fields":{"answer":{"value":"a","time":1,"writer":"a"}}}');
  const b = parseDocument('{"version":1,"fields":{"answer":{"value":"b","time":1,"writer":"b"}}}');
  assert.deepEqual(mergeDocuments(a,b),mergeDocuments(b,a));
  assert.equal(mergeDocuments(a,b).fields.answer.value,'b');
});
test('damaged or incompatible storage does not crash the lesson', () => {
  for (const input of [null, 'undefined', '{}', '{"version":2,"fields":{}}', '{"version":1,"fields":{"broken":null}}']) assert.deepEqual(parseDocument(input),{version:1,fields:{}});
});
test('all fourteen original exercise numbers and required mechanics are present', () => {
  assert.deepEqual(exercises.map(e=>e.number),Array.from({length:14},(_,i)=>i+1));
  assert.equal(new Set(exercises.map(e=>e.id)).size,14);
  assert.deepEqual(choices.map(q=>q.correct),['a','b','a','a','a']);
  assert.equal(exercises.find(e=>e.type==='memory')?.duration,120);
  const dictation = exercises.find(e=>e.type==='dictation');
  assert.equal(dictation?.questions?.length,8);
  assert.equal(dictation?.hints?.length,8);
});
