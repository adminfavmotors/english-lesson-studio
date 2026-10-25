import { test } from 'node:test';
import assert from 'node:assert/strict';
import { choices } from '../src/lesson.ts';
import { beginMemoryRecall, memoryCards, memoryState, rateMemoryRecall } from '../src/memory-practice.ts';
import { emptyDocument } from '../src/store-model.ts';
import type { Document,Value } from '../src/store-model.ts';
const cards=memoryCards(choices);
const apply=(doc:Document,values:Record<string,Value>):Document=>({version:1,fields:{...doc.fields,...Object.fromEntries(Object.entries(values).map(([key,value])=>[key,{value,time:1,writer:'test'}]))}});
test('individual memory cards use the five original correct sentence pairs',()=>{
  assert.equal(cards.length,5);
  assert.equal(cards[0].cue,choices[0].options[0]);assert.equal(cards[1].cue,choices[1].options[1]);
  assert.deepEqual(cards.map(card=>card.answer),choices.map(q=>q.text));
});
test('review is self-paced and legacy timer state does not skip it',()=>{
  const old=apply(emptyDocument(),{'ex2.deadline':1,'ex2.hidden':true});
  assert.equal(memoryState('ex2',old,cards,10000,120).phase,'learn');
  assert.equal(memoryState('ex2',old,cards,10000,120).timerEnabled,false);
});
test('optional review timer moves to recall at expiry and remains there after reload',()=>{
  const timed=apply(emptyDocument(),{'ex2.memory.phase':'learn','ex2.memory.timerEnabled':true,'ex2.deadline':121000});
  assert.equal(memoryState('ex2',timed,cards,61000,120).phase,'learn');
  const after=memoryState('ex2',JSON.parse(JSON.stringify(timed)),cards,121001,120);
  assert.equal(after.phase,'recall');assert.equal(after.revealed,false);assert.equal(after.current?.id,'1');
});
test('self-check requires revealing the answer, advances all five cards, then completes',()=>{
  let doc=apply(emptyDocument(),beginMemoryRecall('ex2',cards.map(c=>c.id)));
  assert.deepEqual(rateMemoryRecall('ex2',memoryState('ex2',doc,cards,0,120),'remembered'),{});
  for(let i=0;i<5;i++){
    doc=apply(doc,{'ex2.memory.revealed':true});
    const state=memoryState('ex2',doc,cards,0,120);assert.equal(state.index,i);
    doc=apply(doc,rateMemoryRecall('ex2',state,i===1||i===4?'again':'remembered'));
    if(i<4)assert.equal(doc.fields['ex2.complete'].value,false);
  }
  const result=memoryState('ex2',doc,cards,0,120);
  assert.equal(result.phase,'summary');assert.equal(result.remembered,3);assert.deepEqual(result.again,['2','5']);assert.equal(result.reviewed,5);
  assert.equal(doc.fields['ex2.complete'].value,true);
});
test('retry keeps a fixed queue of difficult cards and clears their draft answers',()=>{
  let doc=apply(emptyDocument(),{'ex2.memory.rating.1':'remembered','ex2.memory.rating.2':'again','ex2.memory.rating.5':'again','ex2.answer.recall.2':'old response'});
  doc=apply(doc,beginMemoryRecall('ex2',['2','5']));
  assert.equal(doc.fields['ex2.answer.recall.2'].value,null);
  assert.equal(doc.fields['ex2.memory.rating.1'].value,'remembered');
  doc=apply(doc,{'ex2.memory.revealed':true});doc=apply(doc,rateMemoryRecall('ex2',memoryState('ex2',doc,cards,0,120),'remembered'));
  const next=memoryState('ex2',doc,cards,0,120);
  assert.deepEqual(next.round,['2','5']);assert.equal(next.current?.id,'5');assert.equal(next.revealed,false);
});
