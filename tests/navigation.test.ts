import test from 'node:test';
import assert from 'node:assert/strict';
import { canNavigateInApp } from '../src/navigation.ts';

const origin='https://lesson.example';
test('ordinary page transitions reuse the public or workspace document', () => {
  assert.equal(canNavigateInApp(origin+'/teacher/materials','/teacher/materials'),true);
  assert.equal(canNavigateInApp(origin+'/#experience','/'),true);
  for (const [from,to] of [['/','/login'],['/login','/'],['/teacher/students','/teacher/materials'],['/teacher/materials/a1-01','/teacher/materials'],['/teacher/materials','/teacher/classroom'],['/student/classroom','/student/lessons/a1-01']]) {
    assert.equal(canNavigateInApp(origin+from,to),true,from+' → '+to);
  }
});
test('invitations, account callbacks and workspace boundaries get a fresh document', () => {
  for (const [from,to] of [['/teacher/materials','/student/lessons/a1-01'],['/teacher/materials','/'],['/login','/teacher/materials'],['/teacher/classroom?session=abc#access=secret','/teacher/materials'],['/teacher/materials','/teacher/classroom?session=abc#access=secret'],['/login#access_token=secret','/'],['/','https://other.example/login'],['/','#experience'],['/','/unknown']]) {
    assert.equal(canNavigateInApp(origin+from,to),false,from+' → '+to);
  }
});
