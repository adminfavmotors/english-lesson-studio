import test from 'node:test';
import assert from 'node:assert/strict';
import { accountDestination, saveAccountReturn, readAccountReturn, clearAccountReturn } from '../src/account-return.ts';
import { accountToken, setAccountTokenSource } from '../src/account-token.ts';

test('Clerk return retains lesson credentials locally and rejects external or unknown destinations',()=>{
  const values=new Map<string,string>();
  Object.defineProperty(globalThis,'sessionStorage',{configurable:true,value:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key)}});
  const origin='https://lesson.example';
  const path='/student/classroom?session=abc#access='+ 'a'.repeat(64)+'&section=grammar';
  saveAccountReturn(origin+path);
  assert.equal(readAccountReturn(origin),path);
  assert.equal(readAccountReturn(origin),path,'React strict renders must not consume the return link');
  clearAccountReturn();assert.equal(readAccountReturn(origin),null);
  assert.equal(accountDestination(origin+'/login'),null);
  for(const value of ['https://evil.example/student/classroom','//evil.example/student/classroom','/unknown']) {
    values.set('lessonstudio.account-return.v1',value);assert.equal(readAccountReturn(origin),null);
  }
  delete (globalThis as {sessionStorage?:Storage}).sessionStorage;
});

test('every API request obtains a current Clerk token and stale cleanup cannot clear a newer source',async()=>{
  let counter=0;
  const releaseOld=setAccountTokenSource(async()=> 'old');
  const release=setAccountTokenSource(async()=> 'fresh-'+(++counter));
  releaseOld();
  assert.equal(await accountToken(),'fresh-1');assert.equal(await accountToken(),'fresh-2');
  release();assert.equal(await accountToken(),null);
});
