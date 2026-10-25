import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession, readSession, writeSession, SessionError } from '../src/session-api.ts';
import type { Operation } from '../src/session-api.ts';
import { backend } from '../src/backend.config.ts';

test('real Supabase: independent clients, durable writes, roles, resets and isolation',async t=>{
  const session=await createSession();
  const teacher={id:session.id,token:session.teacher_token};
  const student={id:session.id,token:session.student_token};
  const operation=(values:Operation['values'],epochs:Operation['epochs']={}):Operation=>({id:crypto.randomUUID(),action:'patch',values,epochs,exercise:null});
  try{
    await t.test('student role cannot obtain teacher or student invitation secrets',async()=>{
      const read=await readSession(student);
      assert.equal(read.role,'student');assert.equal(read.student_token,null);assert.equal('teacher_token' in read,false);
    });
    await t.test('concurrent independent field writes preserve both answers',async()=>{
      await Promise.all([writeSession(student,operation({'ex3.answer.1':'Student writes from another device'})),writeSession(teacher,operation({'ex11.answer.1':'A different answer'}))]);
      const read=await readSession(teacher);
      assert.equal(read.document?.fields['ex3.answer.1'].value,'Student writes from another device');
      assert.equal(read.document?.fields['ex11.answer.1'].value,'A different answer');
    });
    await t.test('teacher review persists and an answer edit invalidates it',async()=>{
      await writeSession(teacher,operation({'ex3.answer.1.grade':'correct'}));
      assert.equal((await readSession(student)).document?.fields['ex3.answer.1.grade'].value,'correct');
      await writeSession(student,operation({'ex3.answer.1':'Edited answer'}));
      assert.equal((await readSession(teacher)).document?.fields['ex3.answer.1.grade'].value,null);
    });
    await t.test('student cannot grade, reset everything, or hide teacher-controlled text',async()=>{
      const forbidden=[operation({'ex3.answer.1.grade':'correct'}),operation({'ex3.answer.1.grade':null}),operation({'ex6.hidden':true}),{...operation({}),action:'reset_all' as const}];
      for(const op of forbidden) await assert.rejects(()=>writeSession(student,op),(e:unknown)=>e instanceof SessionError&&e.status===403);
    });
    await t.test('retries are idempotent and unchanged reads omit the document',async()=>{
      const op=operation({'ex12.answer.1':'An idempotent answer'});const first=await writeSession(student,op);const repeat=await writeSession(student,op);
      assert.equal(first.revision,repeat.revision);
      assert.equal((await readSession(student,repeat.revision)).document,null);
    });
    await t.test('teacher reset rejects stale offline edits without clearing another exercise',async()=>{
      const reset=await writeSession(teacher,{...operation({}),action:'reset_exercise',exercise:'ex3'});
      assert.equal(reset.epochs.ex3,1);
      const stale=await writeSession(student,operation({'ex3.answer.1':'Must never reappear'}));
      assert.deepEqual(stale.discarded,['ex3']);assert.equal(stale.document?.fields['ex3.answer.1'].value,null);
      assert.equal(stale.document?.fields['ex11.answer.1'].value,'A different answer');
    });
    await t.test('wrong tokens cannot read another session and private tables are unavailable',async()=>{
      await assert.rejects(()=>readSession({id:session.id,token:'0'.repeat(64)}),(e:unknown)=>e instanceof SessionError&&e.status===403);
      const direct=await fetch(`${backend.url}/rest/v1/sessions?select=*`,{headers:{apikey:backend.publishableKey}});
      assert.equal(direct.ok,false);
      const privateSchema=await fetch(`${backend.url}/rest/v1/sessions?select=*`,{headers:{apikey:backend.publishableKey,'Accept-Profile':'lesson_private'}});
      assert.equal(privateSchema.ok,false);
    });
    await t.test('student memory practice, confidence and restart sync without changing other work',async()=>{
      await writeSession(student,operation({'ex2.memory.phase':'recall','ex2.memory.queue':'1,2,3,4,5','ex2.memory.index':1,'ex2.memory.revealed':true,'ex2.memory.rating.1':'remembered','ex2.answer.recall.1':'The economy is quite weak.'}));
      const seen=await readSession(teacher);
      assert.equal(seen.document?.fields['ex2.memory.index'].value,1);
      assert.equal(seen.document?.fields['ex2.memory.rating.1'].value,'remembered');
      assert.equal(seen.document?.fields['ex2.answer.recall.1'].value,'The economy is quite weak.');
      await writeSession(student,{...operation({}),action:'reset_exercise',exercise:'ex2'});
      const reset=await readSession(teacher);
      assert.equal(reset.document?.fields['ex2.memory.phase'].value,null);
      assert.equal(reset.document?.fields['ex11.answer.1'].value,'A different answer');
      assert.equal(reset.epochs.ex2,1);
    });
    await t.test('only teacher can set student details, calendar and the whole lesson timer',async()=>{
      const values={'lesson.studentName':'Test learner','lesson.studentLevel':'B1 · Intermediate','lesson.title':'Speaking practice','lesson.number':'12','lesson.date':'2026-10-26','lesson.time':'15:30','lesson.timeZone':'Europe/Warsaw','lesson.timer.duration':2700,'lesson.timer.remaining':2700,'lesson.timer.deadline':null,'lesson.timer.state':'idle'};
      await writeSession(teacher,operation(values));
      const read=await readSession(student);
      assert.equal(read.document?.fields['lesson.studentName'].value,'Test learner');
      assert.equal(read.document?.fields['lesson.date'].value,'2026-10-26');
      assert.equal(read.document?.fields['lesson.timer.duration'].value,2700);
      for(const patch of [{'lesson.studentName':'Changed by student'},{'lesson.date':'2026-11-01'},{'lesson.timer.deadline':99999999}]) await assert.rejects(()=>writeSession(student,operation(patch)),(e:unknown)=>e instanceof SessionError&&e.status===403);
      for(const patch of [{'lesson.timer.duration':0},{'lesson.date':'2026-02-30'},{'lesson.timer.state':'invalid'}]) await assert.rejects(()=>writeSession(teacher,operation(patch)),(e:unknown)=>e instanceof SessionError&&e.status===400);
      await writeSession(teacher,{...operation({}),action:'reset_all'});
      assert.equal((await readSession(student)).document?.fields['lesson.studentName'].value,'Test learner');
      assert.equal((await readSession(student)).document?.fields['lesson.timer.duration'].value,2700);
    });
  }finally{await writeSession(teacher,{...operation({}),action:'reset_all'});}
});
