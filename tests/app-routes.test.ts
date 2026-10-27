import test from "node:test";
import assert from "node:assert/strict";
import { canonicalAppUrl, resolveAppRoute, studentLessonPath, teacherMaterialPath } from "../src/app-routes.ts";

const origin="https://lesson.example";
test("teacher and student pages have independent paths",()=>{
  assert.deepEqual(resolveAppRoute(origin),{area:"entry"});
  assert.equal(canonicalAppUrl(origin+"/teacher").pathname,"/teacher/materials");
  assert.equal(canonicalAppUrl(origin+"/student").pathname,"/student/classroom");
  assert.deepEqual(resolveAppRoute(origin+"/teacher/students"),{area:"teacher",page:"students"});
  assert.deepEqual(resolveAppRoute(origin+studentLessonPath("a1-19")),{area:"student",page:"lesson",materialId:"a1-19"});
  assert.deepEqual(resolveAppRoute(origin+teacherMaterialPath("a1-19")),{area:"teacher",page:"materials",materialId:"a1-19"});
});
test("legacy bookmarks resolve to the matching workspace",()=>{
  assert.equal(canonicalAppUrl(origin+"/?mode=teacher&view=students").href,origin+"/teacher/students");
  assert.equal(canonicalAppUrl(origin+"/?mode=teacher&view=assignments&material=a1-03").pathname,"/teacher/materials/a1-03");
  assert.equal(canonicalAppUrl(origin+"/?mode=student&view=material&material=a1-03").pathname,"/student/lessons/a1-03");
  assert.equal(canonicalAppUrl(origin+"/?mode=student#reading").href,origin+"/student/classroom#reading");
});
test("query parameters cannot switch the workspace of a canonical URL",()=>{
  assert.deepEqual(resolveAppRoute(origin+"/student/classroom?mode=teacher&view=students"),{area:"student",page:"classroom"});
  assert.equal(canonicalAppUrl(origin+"/student/classroom?mode=teacher&view=students").search,"");
  assert.deepEqual(resolveAppRoute(origin+"/student/students?mode=teacher"),{area:"not-found",workspace:"student"});
  assert.deepEqual(resolveAppRoute(origin+"/teacher/lessons/a1-01?mode=student"),{area:"not-found",workspace:"teacher"});
});
test("canonicalising an invitation preserves its capability and section",()=>{
  const fragment="#access="+"a".repeat(64)+"&section=grammar";
  const url=canonicalAppUrl(origin+"/?mode=student&session=example"+fragment);
  assert.equal(url.pathname,"/student/classroom");
  assert.equal(url.search,"?session=example");
  assert.equal(url.hash,fragment);
  assert.equal(canonicalAppUrl(origin+"/teacher/students?session=example"+fragment).pathname,"/teacher/classroom");
});
test("account confirmation fragments survive old-address redirects",()=>{
  const fragment="#access_token=account-token&refresh_token=refresh-token&type=signup";
  const url=canonicalAppUrl(origin+"/?mode=teacher&view=students"+fragment);
  assert.equal(url.pathname,"/teacher/students");
  assert.equal(url.hash,fragment);
  assert.equal(url.search,"");
});
test("unknown and encoded cross-workspace paths never become lesson IDs",()=>{
  assert.equal(resolveAppRoute(origin+"/student/lessons/%2Fteacher").area,"not-found");
  assert.equal(resolveAppRoute(origin+"/teacher/materials/a1-01/extra").area,"not-found");
});
