import test from 'node:test';
import assert from 'node:assert/strict';
import { mayOpenWorkspace, workspaceHome, workspaceRole } from '../src/workspace-access.ts';
import { canonicalAppUrl, resolveAppRoute } from '../src/app-routes.ts';
import { isTeacherAuthCallback } from '../src/teacher-auth-url.ts';

test('public landing anchors and the shared sign-in route stay outside workspaces', () => {
  for (const hash of ['experience','how-it-works','landing-main']) {
    assert.equal(canonicalAppUrl('https://lesson.example/#'+hash).pathname, '/');
    assert.equal(resolveAppRoute('https://lesson.example/#'+hash).area, 'entry');
  }
  assert.deepEqual(resolveAppRoute('https://lesson.example/login'), {area:'login'});
  assert.equal(isTeacherAuthCallback(new URL('https://lesson.example/login'), {access_token:'token'}), true);
  assert.equal(isTeacherAuthCallback(new URL('https://lesson.example/login?session=secret'), {access_token:'token'}), false);
});
test('only recognised server roles open workspaces; students cannot open teacher routes', () => {
  for (const input of [null,undefined,'admin','owner',{role:'teacher'},true]) assert.equal(workspaceRole(input), null);
  assert.equal(workspaceRole('teacher'), 'teacher');
  assert.equal(workspaceRole('student'), 'student');
  assert.equal(workspaceHome('teacher'), '/teacher/materials');
  assert.equal(workspaceHome('student'), '/student/classroom');
  assert.equal(mayOpenWorkspace('student',{area:'teacher',page:'materials'}),false);
  assert.equal(mayOpenWorkspace('student',{area:'teacher',page:'students'}),false);
  assert.equal(mayOpenWorkspace('teacher',{area:'teacher',page:'materials'}),true);
  assert.equal(mayOpenWorkspace('teacher',{area:'student',page:'lesson',materialId:'a1-01'}),true);
});
