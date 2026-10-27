import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashForSection, sectionFromHash, sessionLink, parseSessionUrl, readSession, SessionError } from '../src/session-api.ts';
import { SessionSync, overlayOperations } from '../src/session-sync.ts';
import type { SessionData, Operation } from '../src/session-api.ts';
import { emptyDocument } from '../src/store-model.ts';

const credentials={id:'00000000-0000-4000-8000-000000000001',token:'a'.repeat(64)};
const op=(values: Operation['values'],epochs: Operation['epochs']={}):Operation=>({id:crypto.randomUUID(),action:'patch',exercise:null,epochs,values});
const response=(changes:Partial<SessionData>={}):SessionData=>({id:credentials.id,role:'student',revision:0,document:emptyDocument(),epochs:{},server_time:Date.now(),...changes});

test('shared request failures preserve their status and present a useful message',async(context)=>{
  context.mock.method(globalThis,'fetch',async()=>new Response(JSON.stringify({message:'Unexpected database detail'}),{status:403,headers:{'Content-Type':'application/json'}}));
  await assert.rejects(()=>readSession(credentials),(error:unknown)=>error instanceof SessionError && error.status===403 && error.message.includes('full link') && !error.message.includes('database detail'));
});

test('invitation capability stays in fragment while navigation preserves it',()=>{
  const link=sessionLink('https://lesson.example/?irrelevant=1#reading',credentials,'student');
  assert.deepEqual(parseSessionUrl(link),credentials);
  const url=new URL(link); assert.ok(!url.search.includes(credentials.token));
  assert.equal(url.pathname,'/student/classroom');assert.equal(url.searchParams.has('mode'),false);
  assert.equal(new URL(sessionLink('https://lesson.example/student/lessons/a1-01',credentials,'teacher')).pathname,'/teacher/classroom');
  url.hash=hashForSection(url.hash,'grammar');
  assert.equal(sectionFromHash(url.hash),'grammar');
  assert.deepEqual(parseSessionUrl(url.toString()),credentials);
  assert.throws(()=>parseSessionUrl(`https://lesson.example/?session=${credentials.id}`));
});
test('optimistic changes keep other fields and invalidate a previous review',()=>{
  const doc={version:1 as const,fields:{'ex3.answer.1.grade':{value:'correct',time:1,writer:'teacher'},'ex11.answer.1':{value:'keep me',time:1,writer:'student'}}};
  const next=overlayOperations(doc,{},[op({'ex3.answer.1':'new answer'})]);
  assert.equal(next.fields['ex3.answer.1'].value,'new answer');
  assert.equal(next.fields['ex3.answer.1.grade'].value,null);
  assert.equal(next.fields['ex11.answer.1'].value,'keep me');
});
test('queued edits from before a reset cannot resurrect the answer',()=>{
  const next=overlayOperations(emptyDocument(),{ex3:1},[op({'ex3.answer.1':'old offline answer'})]);
  assert.equal(next.fields['ex3.answer.1'],undefined);
});
test('network failure retains outbox across reload and retries idempotent operation',async()=>{
  const cacheData=new Map<string,string>();
  const cache={getItem:(key:string)=>cacheData.get(key)??null,setItem:(key:string,value:string)=>{cacheData.set(key,value);}};
  let fail=true; const sent:string[]=[];
  const transport={read:async()=>response(),write:async(_c:unknown,operation:Operation)=>{
    sent.push(operation.id); if(fail) throw new Error('Network offline');
    return response({revision:1,document:{version:1,fields:{'ex3.answer.1':{value:operation.values['ex3.answer.1'],time:1,writer:operation.id}}}});
  }};
  const first=new SessionSync(credentials,{transport,cache,clientId:'stable-tab'});
  try{
    await first.syncOnce(); first.enqueue({'ex3.answer.1':'survives reload'}); await first.syncOnce();
    assert.equal(first.getSnapshot().status,'offline'); assert.equal(first.getSnapshot().pendingCount,1);
  }finally{first.stop();}
  fail=false;
  const reloaded=new SessionSync(credentials,{transport,cache,clientId:'stable-tab'});
  try{
    assert.equal(reloaded.getSnapshot().document.fields['ex3.answer.1'].value,'survives reload');
    assert.equal(reloaded.getSnapshot().role,null,'Cached work does not grant a workspace role');
    await reloaded.syncOnce(); assert.equal(reloaded.getSnapshot().role,'student');
    assert.equal(reloaded.getSnapshot().pendingCount,1,'The first request verifies the link before sending cached changes');
    await reloaded.syncOnce(); assert.equal(reloaded.getSnapshot().pendingCount,0);
    assert.equal(reloaded.getSnapshot().status,'online'); assert.equal(sent[0],sent[1]);
  }finally{reloaded.stop();}
});
test('edits typed during an in-flight save remain queued',async()=>{
  let finish:((value:SessionData)=>void)|undefined;
  const sync=new SessionSync(credentials,{transport:{read:async()=>response(),write:()=>new Promise<SessionData>(resolve=>{finish=resolve;})}});
  try{
    await sync.syncOnce();sync.enqueue({'ex3.answer.1':'first'});
    const saving=sync.syncOnce();sync.enqueue({'ex3.answer.1':'second'});
    finish!(response({revision:1,document:{version:1,fields:{'ex3.answer.1':{value:'first',time:1,writer:'server'}}}}));
    await saving;
    assert.equal(sync.getSnapshot().pendingCount,1);
    assert.equal(sync.getSnapshot().document.fields['ex3.answer.1'].value,'second');
  }finally{sync.stop();}
});
