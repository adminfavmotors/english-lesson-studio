import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calendarDays, formatTimer, lessonTimerState, parseLessonDate, timerChanges } from '../src/lesson-workspace.ts';
import { emptyDocument } from '../src/store-model.ts';
import type { Document, Value } from '../src/store-model.ts';
const document=(values:Record<string,Value>):Document=>({version:1,fields:Object.fromEntries(Object.entries(values).map(([key,value])=>[key,{value,time:1,writer:'test'}]))});
test('whole lesson timer starts, pauses without drift, resumes and survives reload',()=>{
  const initial=lessonTimerState(emptyDocument(),100000);
  assert.equal(initial.duration,3600);assert.equal(initial.started,false);
  const duration=timerChanges('duration',initial,100000,45);
  const configured=lessonTimerState(document(duration),100000);
  const started=timerChanges('start',configured,100000);
  const running=lessonTimerState(document({...duration,...started}),161200);
  assert.equal(running.running,true);assert.equal(running.remaining,2639);
  const paused=timerChanges('pause',running,162100);
  const afterReload=lessonTimerState(document({...duration,...paused}),600000);
  assert.equal(afterReload.remaining,2638);assert.equal(afterReload.running,false);
  const resumed=timerChanges('start',afterReload,600000);
  assert.equal(resumed['lesson.timer.deadline'],3238000);
});
test('lesson timer ends at zero and can be reset independently of exercises',()=>{
  const doc=document({'lesson.timer.duration':60,'lesson.timer.deadline':100000,'ex3.answer.1':'keep this answer'});
  const ended=lessonTimerState(doc,120000);
  assert.equal(ended.remaining,0);assert.equal(ended.finished,true);assert.equal(formatTimer(0),'00:00');
  const reset=timerChanges('reset',ended,120000);
  assert.equal(reset['lesson.timer.remaining'],60);
  assert.ok(Object.keys(reset).every(key=>key.startsWith('lesson.timer.')));
  assert.equal(formatTimer(3600),'60:00');
});
test('lesson length rejects invalid values',()=>{
  for(const value of [0,241,1.5,NaN]) assert.throws(()=>timerChanges('duration',lessonTimerState(emptyDocument(),0),0,value));
});
test('server clock correction produces an integer deadline even with half-millisecond offset',()=>{
  const values=timerChanges('start',lessonTimerState(emptyDocument(),100000),100000.5);
  assert.equal(Number.isInteger(values['lesson.timer.deadline']),true);
  assert.equal(lessonTimerState(document(values),0).remaining,3600);
});
test('calendar starts on Monday and handles a leap year and month boundaries',()=>{
  const days=calendarDays(2026,9);
  assert.deepEqual(days.slice(0,4),[null,null,null,'2026-10-01']);
  assert.equal(days.filter(Boolean).length,31);assert.equal(days.length%7,0);
  assert.equal(calendarDays(2028,1).filter(Boolean).length,29);
  assert.equal(parseLessonDate('2026-02-30'),null);
  assert.ok(parseLessonDate('2028-02-29'));
});
