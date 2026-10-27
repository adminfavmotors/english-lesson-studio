import test from 'node:test';
import assert from 'node:assert/strict';
import { studentInvitationError, studentInvitationLink, studentInvitationToken } from '../src/student-invitation.ts';
import { canonicalAppUrl, resolveAppRoute } from '../src/app-routes.ts';
import { canNavigateInApp } from '../src/navigation.ts';
import { isTeacherAuthCallback, teacherAccountReturnUrl } from '../src/teacher-auth-url.ts';

test('a personal invitation has its own student route and a fragment-only secret', () => {
  const token = 'a'.repeat(64);
  const link = studentInvitationLink('https://lesson.example/teacher/students?session=old#access=old', token);
  const url = new URL(link);
  assert.equal(url.pathname, '/student/connect');
  assert.equal(url.search, '');
  assert.equal(studentInvitationToken(link), token);
  assert.deepEqual(resolveAppRoute(link), { area: 'student', page: 'connect' });
  assert.equal(canonicalAppUrl(link + '&mode=teacher').pathname, '/student/connect');
  assert.equal(studentInvitationToken('https://lesson.example/student/classroom#invite=' + token), null);
});
test('malformed, duplicate and query-only invitation secrets cannot be used', () => {
  for (const suffix of ['#invite=short', '?invite=' + 'a'.repeat(64), '#invite=' + 'a'.repeat(64) + '&invite=' + 'b'.repeat(64), '#invite=' + 'z'.repeat(64)]) {
    assert.equal(studentInvitationToken('https://lesson.example/student/connect' + suffix), null);
  }
  assert.throws(() => studentInvitationLink('https://lesson.example/', 'short'));
});
test('personal invitations reload at navigation boundaries and are separate from Auth callbacks', () => {
  const link = studentInvitationLink('https://lesson.example/', 'b'.repeat(64));
  assert.equal(canNavigateInApp(link, '/student/classroom'), false);
  assert.equal(canNavigateInApp('https://lesson.example/student/classroom', link), false);
  assert.equal(isTeacherAuthCallback(new URL(link), { invite: 'b'.repeat(64), access_token: 'account' }), false);
  assert.equal(isTeacherAuthCallback(new URL('https://lesson.example/login'), { invite: 'b'.repeat(64), access_token: 'account' }), false);
  const callback = new URL(teacherAccountReturnUrl(link));
  assert.equal(callback.hash, '');
  assert.equal(callback.searchParams.has('invite'), false);
});
test('invitation errors give a recovery action without exposing database details', () => {
  assert.equal(studentInvitationError({ message: 'Sign in with the email address your teacher invited, then reopen this link.' }), 'Sign in with the email address your teacher invited, then reopen this link.');
  assert.ok(!studentInvitationError({ message: 'private schema and SQL details' }).includes('SQL'));
});
