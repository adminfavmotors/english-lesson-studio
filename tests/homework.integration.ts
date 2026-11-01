import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { testDatabase } from './helpers/test-database.ts';
import { dictationWords } from '../src/dictation-model.ts';
const document=JSON.parse(fs.readFileSync(new URL('../scripts/materials/dictation-in-the-news.json',import.meta.url),'utf8'));
const teacher='e1000000-0000-4000-8000-000000000001',student='e1000000-0000-4000-8000-000000000002',otherTeacher='e1000000-0000-4000-8000-000000000003',otherStudent='e1000000-0000-4000-8000-000000000004';
const card='e2000000-0000-4000-8000-000000000001',otherCard='e2000000-0000-4000-8000-000000000002',id='e3000000-0000-4000-8000-000000000001';
test('assigned dictation: authorisation, immutable content, saved answers, submission and teacher review',async t=>{
 const db=await testDatabase();
 const call=async(name:string,args:unknown[]=[])=>{const r=await db.query(`select public.${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) as result`,args);return r.rows[0].result as any;};
 const as=async(user:string)=>{
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({iss:'https://lesson.example/__clerk',azp:'https://lesson.example',sub:'user_'+user.replaceAll('-',''),sid:'sess_homeworkQA',sts:'active',role:'authenticated',email:user+'@example.invalid',email_verified:true})]);
  await db.exec('set role authenticated');
 };
 try{
  await db.query('insert into lesson_private.clerk_settings(issuer,allowed_origins) values($1,$2)',['https://lesson.example/__clerk',['https://lesson.example']]);
  for(const [account,role] of [[teacher,'teacher'],[student,'student'],[otherTeacher,'teacher'],[otherStudent,'student']]){
   await db.query('insert into lesson_private.accounts(id,email,email_confirmed_at,clerk_user_id) values($1,$2,now(),$3)',[account,account+'@example.invalid','user_'+account.replaceAll('-','')]);
   await db.query('insert into public.workspace_members(user_id,role) values($1,$2)',[account,role]);
  }
  await db.query('insert into public.teacher_students(id,owner_id,student_user_id,connected_at,full_name,email,notes) values($1,$2,$3,now(),$4,$5,$6),($7,$8,$9,now(),$10,$11,$12)',[card,teacher,student,'Homework learner',student+'@example.invalid','PRIVATE NOTE',otherCard,otherTeacher,otherStudent,'Other learner',otherStudent+'@example.invalid','OTHER PRIVATE NOTE']);
  const c=document.catalogue,fields=Object.keys(c),values=Object.values(c).map(v=>v&&typeof v==='object'?JSON.stringify(v):v);
  await db.query(`insert into public.lesson_materials(id,${fields.join(',')},content) values($1,${fields.map((_,i)=>'$'+(i+2)).join(',')},$${fields.length+2})`,['dictation-in-the-news',...values,JSON.stringify(document.content)]);
  let assigned:any;
  await t.test('only the owning teacher can assign supported homework to their connected student',async()=>{
   await as(student);await assert.rejects(call('homework_create',[id,card,'dictation-in-the-news']),/Only your teacher/);
   await as(otherTeacher);await assert.rejects(call('homework_create',[id,card,'dictation-in-the-news']),/unavailable/);
   await as(teacher);await assert.rejects(call('homework_create',[id,card,'a1-01']),/not available as assigned homework/);
   assigned=await call('homework_create',[id,card,'dictation-in-the-news']);assert.equal(assigned.status,'not_completed');assert.equal(assigned.result.total,dictationWords(document.content.sentences).flat().length);
   assert.equal((await call('homework_create',[id,card,'dictation-in-the-news'])).version,1);
   assert.equal((await call('homework_list',[card])).length,1);
  });
  await t.test('another teacher/student, anonymous caller and direct private access are denied',async()=>{
   for(const user of [otherTeacher,otherStudent]){await as(user);assert.deepEqual(await call('homework_list'),[]);await assert.rejects(call('homework_get',[id]),/unavailable/);await assert.rejects(call('homework_save',[id,1,'{}']),/unavailable/);}
   await assert.rejects(db.query('select * from lesson_private.homework'),/permission denied/);
   await db.exec('reset role;set role anon');await assert.rejects(call('homework_get',[id]),/permission denied/);
  });
  await t.test('students receive only their assigned snapshot and no library or teacher notes',async()=>{
   await as(student);const h=await call('homework_get',[id]);assert.equal(h.student_name,'Homework learner');assert.equal(h.content.sentences.length,15);assert.equal(JSON.stringify(h).includes('PRIVATE NOTE'),false);
   assert.equal((await call('homework_list')).length,1);assert.equal('content' in (await call('homework_list'))[0],false);
   assert.equal((await db.query('select count(*)::int as n from public.lesson_materials')).rows[0].n,0);
   await db.exec('reset role');await db.exec("update public.lesson_materials set content=jsonb_set(content,'{goal}','\"Updated future revision\"') where id='dictation-in-the-news'");
   await as(student);const frozen=await call('homework_get',[id]);assert.equal(frozen.material_version,assigned.material_version);assert.equal(frozen.content.goal,document.content.goal);
  });
  await t.test('partial answers survive reload, reject stale writes and cannot mark unfinished work complete',async()=>{
   await as(student);const progress={s1w1:{value:'the',hints:0,revealed:false},s1w2:{value:'mayr',hints:1,revealed:false}};
   const saved=await call('homework_save',[id,1,JSON.stringify(progress)]);assert.equal(saved.version,2);assert.equal(saved.result.done,1);assert.equal(saved.status,'not_completed');
   assert.equal((await call('homework_save',[id,1,JSON.stringify(progress)])).version,2,'A retry after a lost acknowledgement does not duplicate the save.');
   assert.deepEqual((await call('homework_get',[id])).progress,progress);
   await assert.rejects(call('homework_save',[id,1,'{}']),/another device/);
   await assert.rejects(call('homework_submit',[id,2,JSON.stringify(progress)]),/Finish every word/);
   for(const bad of [{unknown:{value:'The',hints:0,revealed:false}},{s1w1:{value:'The',hints:99,revealed:false}},{s1w1:{value:'The',hints:0,revealed:false,score:100}}])await assert.rejects(call('homework_save',[id,2,JSON.stringify(bad)]));
   await assert.rejects(call('homework_review',[id,2,'Well done']),/Only the assigning teacher/);
   await as(teacher);await assert.rejects(call('homework_save',[id,2,'{}']),/Only the assigned student/);await assert.rejects(call('homework_review',[id,2,'Well done']),/Wait for the student/);
  });
  await t.test('server grading distinguishes independently correct, hinted and shown words; submission locks answers',async()=>{
   const progress=Object.fromEntries(dictationWords(document.content.sentences).flat().map((word,i)=>[word.id,{value:i===0?word.answer:word.answer.toLowerCase().replace(/[’']/g,''),hints:i===1?1:0,revealed:i===0}]));
   await as(student);const completed=await call('homework_submit',[id,2,JSON.stringify(progress)]);assert.equal(completed.status,'completed');assert.equal(completed.result.shown,1);assert.equal(completed.result.hinted,1);assert.equal(completed.result.done,completed.result.total);
   assert.equal((await call('homework_submit',[id,2,JSON.stringify(progress)])).version,completed.version);
   await assert.rejects(call('homework_save',[id,completed.version,'{}']),/cannot be changed/);
  });
  await t.test('only the assigning teacher can mark submitted work reviewed; the student sees the same feedback/status',async()=>{
   await as(teacher);const before=await call('homework_get',[id]);const reviewed=await call('homework_review',[id,before.version,'Good work. Practise mayor once more.']);assert.equal(reviewed.status,'reviewed');assert.ok(reviewed.reviewed_at);
   assert.equal((await call('homework_review',[id,before.version,reviewed.feedback])).version,reviewed.version);
   assert.equal((await call('homework_list',[card]))[0].status,'reviewed');
   await as(student);const seen=await call('homework_get',[id]);assert.equal(seen.status,'reviewed');assert.equal(seen.feedback,reviewed.feedback);assert.equal((await call('homework_list'))[0].status,'reviewed');
  });
 }finally{await db.close();}
});
