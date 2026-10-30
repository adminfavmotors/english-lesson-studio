import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { backend } from "../src/backend.config.ts";

test("the authenticated teacher library matches all thirty source lessons", {skip: !process.env.LESSON_TEST_ACCESS_TOKEN && "Set LESSON_TEST_ACCESS_TOKEN to a teacher JWT for content checks"}, async () => {
  const lessons = JSON.parse(
    fs.readFileSync(
      new URL("../src/data/a1-lessons.json", import.meta.url),
      "utf8",
    ),
  );
  const versions = JSON.parse(
    fs.readFileSync(
      new URL("../src/data/a1-versions.json", import.meta.url),
      "utf8",
    ),
  );
  const response = await fetch(
    `${backend.url}/rest/v1/lesson_materials?select=id,owner_id,title,subtitle,level,topic,skills,language_focus,classification_status,legacy_skills,duration,sequence,content,version,catalogue_version&owner_id=is.null&order=sequence.asc`,
    {
      headers: { apikey: backend.publishableKey, Authorization: `Bearer ${process.env.LESSON_TEST_ACCESS_TOKEN}` },
      signal: AbortSignal.timeout(20000),
    },
  );
  assert.equal(response.status, 200);
  const rows = await response.json();
  assert.equal(rows.length, 30);
  for (const [index, row] of rows.entries()) {
    assert.equal(row.id, `a1-${String(index + 1).padStart(2, "0")}`);
    assert.equal(row.owner_id, null);
    assert.equal(
      row.version,
      versions[row.id],
      `Packaged version differs for ${row.id}`,
    );
    assert.deepEqual(
      row.content,
      lessons[index].content,
      `Database content differs for ${row.id}`,
    );
    for (const [key, value] of Object.entries(lessons[index].catalogue))
      assert.deepEqual(row[key], value, `Database catalogue differs for ${row.id}: ${key}`);
    assert.ok(row.catalogue_version >= 1);
  }
});

test('anonymous requests cannot fetch the library or create and open lessons', async () => {
 for (const [path,body] of [['lesson_materials?select=*',null], ['rpc/lesson_create',{}], ['rpc/lesson_read',{p_id:'00000000-0000-0000-0000-000000000000',p_revision:-1}]]) {
  const response=await fetch(backend.url+'/rest/v1/'+path,{method:body?'POST':'GET',headers:{apikey:backend.publishableKey,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});
  assert.ok([401,403].includes(response.status), 'Anonymous access must be denied: '+path);
 }
});

test('a real student account cannot read the library or become a teacher', {skip: !process.env.LESSON_TEST_STUDENT_ACCESS_TOKEN && 'Set LESSON_TEST_STUDENT_ACCESS_TOKEN for student checks'}, async () => {
  const headers = {apikey:backend.publishableKey, Authorization:`Bearer ${process.env.LESSON_TEST_STUDENT_ACCESS_TOKEN}`, 'Content-Type':'application/json'};
  const request = (path: string, method='GET', body?: object) => fetch(`${backend.url}/rest/v1/${path}`, {method,headers,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});
  let response=await request('rpc/workspace_role','POST',{});
  assert.equal(response.status,200); assert.equal(await response.json(),'student');
  for (const table of ['lesson_materials','teacher_students']) {
    response=await request(table+'?select=*'); assert.equal(response.status,200); assert.deepEqual(await response.json(),[]);
  }
  response=await request('rpc/lesson_create','POST',{}); assert.equal(response.status,403);
  response=await request('workspace_members?select=user_id');
  assert.equal(response.status,200);
  const [self]=await response.json(); assert.ok(self.user_id);
  response=await request('workspace_members?user_id=eq.'+self.user_id,'PATCH',{role:'teacher'});
  assert.equal(response.status,403);
});
