import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { dictationWords, dictationCounts, dictationMessage, normaliseDictation, editDistance } from '../src/dictation-model.ts';
import { readMaterialDocument, validateMaterialContent } from '../src/material-model.ts';
import { resolveAppRoute, homeworkPath } from '../src/app-routes.ts';
const document=JSON.parse(fs.readFileSync(new URL('../scripts/materials/dictation-in-the-news.json',import.meta.url),'utf8'));
test('the supplied dictation is a distinct, valid 15-sentence A2 material',()=>{
 assert.deepEqual(readMaterialDocument(document).errors,[]);
 assert.equal(document.catalogue.level,'A2');assert.equal(document.content.sentences.length,15);
 const words=dictationWords(document.content.sentences).flat();
 assert.equal(new Set(words.map(w=>w.id)).size,words.length);
 assert.equal(words.filter(w=>w.punctuation.includes(',')).length,3);
 assert.ok(words.some(w=>w.answer==='player’s'));
 assert.deepEqual(dictationCounts(words,{}),{total:words.length,done:0,shown:0,correct:0,hinted:0});
});
test('spelling uses the requested apostrophe/case policy and separates shown words from independent work',()=>{
 const words=dictationWords(['The player’s chances.']).flat();
 const result=dictationCounts(words,{s1w1:{value:'THE',hints:0,revealed:false},s1w2:{value:'players',hints:1,revealed:false},s1w3:{value:'chances',hints:0,revealed:true}});
 assert.deepEqual(result,{total:3,done:3,correct:2,shown:1,hinted:1});
 assert.equal(normaliseDictation(" PLAYER'S "),'players');
});
test('spelling feedback handles substitutions, insertions, missing letters and prefixes',()=>{
 assert.equal(editDistance('plan','plane'),1);assert.equal(editDistance('cat','act'),2);
 const word=dictationWords(['unlikely'])[0][0];
 assert.equal(dictationMessage(word,'unlikelz'),'Almost! One letter is wrong.');
 assert.equal(dictationMessage(word,'un'),'Not finished yet.');
 assert.equal(dictationMessage(word,'factory'),'Not this word. Listen again.');
});
test('invalid dictation content is rejected without requiring unrelated lesson sections',()=>{
 for(const change of [{sentences:['two  spaces']},{sentences:['news-words']},{audioUrl:'javascript:alert(1)'},{kind:'unknown'},{sentences:[]},{teacherNotes:[]}]) assert.ok(validateMaterialContent({...document.content,...change}).length);
 assert.deepEqual(validateMaterialContent(document.content),[]);
});
test('homework links keep their canonical workspace and survive the account return route',()=>{
 const id='f1111111-1111-4111-8111-111111111111';
 assert.deepEqual(resolveAppRoute('https://lesson.example'+homeworkPath('student',id)+'?mode=teacher'),{area:'student',page:'homework',homeworkId:id});
 assert.deepEqual(resolveAppRoute('https://lesson.example'+homeworkPath('teacher',id)),{area:'teacher',page:'homework',homeworkId:id});
 assert.equal(resolveAppRoute('https://lesson.example/student/homework/not-an-id').area,'not-found');
});
