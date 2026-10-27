import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyStudent, studentInitials, studentValues, validateStudent } from '../src/students-model.ts';
import { isTeacherAuthCallback, teacherAccountReturnUrl } from '../src/teacher-auth-url.ts';

test('a new student only requires a name and defaults to active',()=>{
  const draft=emptyStudent();assert.equal(draft.status,'active');assert.ok(validateStudent(draft).full_name);
  draft.full_name='Олена Коваль';assert.deepEqual(validateStudent(draft),{});
});
test('student contact validation permits an empty address but rejects malformed addresses',()=>{
  const draft={...emptyStudent(),full_name:'Anna'};
  for(const email of ['', 'anna@example.com','a+b@school.edu.pl'])assert.equal(validateStudent({...draft,email}).email,undefined);
  for(const email of ['anna','a@b','a b@example.com','a@example.com\nother@example.com'])assert.ok(validateStudent({...draft,email}).email);
});
test('levels, statuses and field limits cannot be bypassed by imported values',()=>{
  const draft={...emptyStudent(),full_name:'Anna'};
  assert.ok(validateStudent({...draft,full_name:'   '}).full_name);
  assert.ok(validateStudent({...draft,full_name:'a'.repeat(121)}).full_name);
  assert.ok(validateStudent({...draft,level:'expert'}).level);
  assert.ok(validateStudent({...draft,status:'admin' as never}).status);
  assert.ok(validateStudent({...draft,goals:'a'.repeat(2001)}).goals);
  assert.ok(validateStudent({...draft,notes:'a'.repeat(5001)}).notes);
});
test('saving a student only includes editable fields and preserves multiline notes',()=>{
  const values=studentValues({...emptyStudent(),full_name:'  Anna Kowalska  ',email:' ANNA@EXAMPLE.COM ',notes:' First line\nSecond line ',owner_id:'forged'} as never);
  assert.equal(values.full_name,'Anna Kowalska');assert.equal(values.email,'anna@example.com');assert.equal(values.notes,'First line\nSecond line');
  assert.equal('owner_id' in values,false);assert.equal('version' in values,false);
});
test('student initials work with Ukrainian, Polish and single names',()=>{
  assert.equal(studentInitials('  Ірина  Коваль '),'ІК');assert.equal(studentInitials('Łukasz Żak'),'ŁŻ');assert.equal(studentInitials('Anna'),'A');assert.equal(studentInitials(''),'');
});
test('account callbacks cannot consume or forward lesson invitation secrets',()=>{
  const invitation='https://example.com/?mode=teacher&view=students&session=test#access=private-lesson-token&section=reading';
  assert.equal(isTeacherAuthCallback(new URL(invitation),{access:'private-lesson-token'}),false);
  assert.equal(isTeacherAuthCallback(new URL(invitation),{access_token:'account-token'}),false);
  assert.equal(teacherAccountReturnUrl(invitation),'https://example.com/?mode=teacher&view=students');
  assert.equal(isTeacherAuthCallback(new URL('https://example.com/?mode=teacher&view=students'),{access_token:'account-token'}),true);
  assert.equal(isTeacherAuthCallback(new URL('https://example.com/?mode=student'),{access_token:'account-token'}),false);
  assert.equal(isTeacherAuthCallback(new URL('https://example.com/teacher/students'),{access_token:'account-token'}),true);
  assert.equal(isTeacherAuthCallback(new URL('https://example.com/student/classroom?mode=teacher&view=students'),{access_token:'account-token'}),false);
});
