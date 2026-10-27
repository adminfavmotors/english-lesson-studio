import test from "node:test";
import assert from "node:assert/strict";
import { classroomStorageKey, LEGACY_CLASSROOM_KEY, loadClassroomDraft } from "../src/classroom-storage.ts";

const previous={version:1,fields:{"ex3.answer.1":{value:"My saved answer",time:1,writer:"old-tab"}}};
function storageFixture() {
  const values=new Map([[LEGACY_CLASSROOM_KEY,JSON.stringify(previous)]]);
  return {values,storage:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);}}};
}
test("old classroom work forks into independent teacher and student drafts",()=>{
  const {values,storage}=storageFixture();
  assert.notEqual(classroomStorageKey("teacher"),classroomStorageKey("student"));
  assert.equal(loadClassroomDraft(storage,"teacher").document.fields["ex3.answer.1"].value,"My saved answer");
  values.set(classroomStorageKey("teacher"),JSON.stringify({version:1,fields:{"ex3.answer.1":{value:"Teacher edit",time:2,writer:"teacher"}}}));
  assert.equal(loadClassroomDraft(storage,"student").document.fields["ex3.answer.1"].value,"My saved answer");
  assert.equal(JSON.parse(values.get(LEGACY_CLASSROOM_KEY)!).fields["ex3.answer.1"].value,"My saved answer");
});
test("an existing workspace draft or reset takes priority over old work",()=>{
  const {values,storage}=storageFixture();
  values.set(classroomStorageKey("student"),"{}");
  assert.deepEqual(loadClassroomDraft(storage,"student").document.fields,{});
  loadClassroomDraft(storage,"teacher");
  assert.equal(values.get(classroomStorageKey("student")),"{}");
});
test("storage quota failure retains the saved work in memory",()=>{
  const {storage}=storageFixture();
  const result=loadClassroomDraft({...storage,setItem:()=>{throw Error("Quota");}},"teacher");
  assert.equal(result.storageError,true);
  assert.equal(result.document.fields["ex3.answer.1"].value,"My saved answer");
});
