import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { testDatabase } from './helpers/test-database.ts';

const migration = '20261031104633_clerk_workspace_accounts.sql';
const owner = 'd1000000-0000-4000-8000-000000000001';
const learner = 'd1000000-0000-4000-8000-000000000002';
const issuer = 'https://lesson.example/__clerk';
const origin = 'https://lesson.example';
const teacherClaims = {iss:issuer,azp:origin,sub:'user_ownerQA',sid:'sess_ownerQA',sts:'active',role:'authenticated',email:'owner@example.invalid',email_verified:true};

test('Clerk cutover preserves identities and enforces the current access contract', async t => {
  const db = await testDatabase({beforeMigration:async(db,name)=>{
    if(name!==migration)return;
    await db.exec(`insert into lesson_private.workspace_owner(singleton,email) values(true,'owner@example.invalid');
      insert into auth.users(id,email,email_confirmed_at) values('${owner}','owner@example.invalid',now()),('${learner}','learner@example.invalid',now());
      insert into public.teacher_students(id,owner_id,full_name,email,notes,student_user_id,connected_at)
        values('d2000000-0000-4000-8000-000000000001','${owner}','Learner','learner@example.invalid','PRIVATE NOTE','${learner}',now());`);
    const {catalogue,content}=JSON.parse(fs.readFileSync(new URL('../src/data/a1-lessons.json',import.meta.url),'utf8'))[0];
    const fields=Object.keys(catalogue);
    const values=Object.values(catalogue).map(value=>value&&typeof value==='object'?JSON.stringify(value):value);
    await db.query(`insert into public.lesson_materials(id,owner_id,${fields.join(',')},content,version,catalogue_version)
      values('private-clerk-qa',$1,${fields.map((_,i)=>'$'+(i+2)).join(',')},$${fields.length+2},7,9)`,[owner,...values,JSON.stringify(content)]);
    await db.query("insert into public.material_favourites(owner_id,material_id) values($1,'private-clerk-qa')",[owner]);
  }});
  const claims = async (value: object) => { await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify(value)]); };
  const asClient = async () => { await db.exec('set role authenticated'); };
  const asAdmin = async () => { await db.exec('reset role'); };
  try {
    await t.test('preserves UUIDs, memberships, roster, connections and removes old Auth coupling',async()=>{
      assert.equal((await db.query('select role from public.workspace_members where user_id=$1',[owner])).rows[0].role,'teacher');
      const row=(await db.query('select owner_id,student_user_id,notes from public.teacher_students')).rows[0];
      assert.deepEqual(row,{owner_id:owner,student_user_id:learner,notes:'PRIVATE NOTE'});
      assert.equal((await db.query("select count(*)::int as n from pg_constraint where contype='f' and confrelid='auth.users'::regclass and connamespace in ('public'::regnamespace,'lesson_private'::regnamespace)")).rows[0].n,0);
      assert.equal((await db.query("select count(*)::int as n from pg_trigger where tgname='provision_workspace_member'")).rows[0].n,0);
    });
    await t.test('fails closed until the issuer is configured',async()=>{
      await claims(teacherClaims);await asClient();
      await assert.rejects(db.query('select public.workspace_account()'),/confirmed account/);
      await asAdmin();
      await db.query('insert into lesson_private.clerk_settings(issuer,allowed_origins) values($1,$2)',[issuer,[origin]]);
    });
    await t.test('rejects unverified email, string booleans, old JWTs, another issuer and another origin',async()=>{
      for(const value of [{...teacherClaims,email_verified:false},{...teacherClaims,email_verified:'true'},
        {...teacherClaims,iss:'https://other.clerk.accounts.dev'},{...teacherClaims,azp:'https://other.example'},
        {...teacherClaims,sid:null},{...teacherClaims,sts:'pending'},{...teacherClaims,azp:null},{...teacherClaims,email:null},{sub:owner,role:'authenticated',email:teacherClaims.email},
        {...teacherClaims,email_verified:false,user_metadata:{email_verified:true,role:'teacher'}}]) {
        await claims(value);await asClient();
        await assert.rejects(db.query('select public.workspace_account()'),/confirmed account/);
        assert.equal((await db.query('select public.workspace_role() as role')).rows[0].role,null);
        assert.equal((await db.query('select count(*)::int as n from public.lesson_materials')).rows[0].n,0);
        await asAdmin();
      }
    });
    await t.test('verified owner claims the existing UUID once and retains teaching access',async()=>{
      await claims(teacherClaims);await asClient();
      const account=(await db.query('select public.workspace_account() as account')).rows[0].account;
      assert.deepEqual(account,{id:owner,email:teacherClaims.email,role:'teacher'});
      assert.deepEqual((await db.query('select public.workspace_account() as account')).rows[0].account,account);
      assert.equal((await db.query('select count(*)::int as n from public.lesson_materials')).rows[0].n,31);
      assert.deepEqual((await db.query("select owner_id,version,catalogue_version from public.lesson_materials where id='private-clerk-qa'")).rows[0],{owner_id:owner,version:7,catalogue_version:9});
      assert.equal((await db.query('select material_id from public.material_favourites')).rows[0].material_id,'private-clerk-qa');
      assert.equal((await db.query('select notes from public.teacher_students')).rows[0].notes,'PRIVATE NOTE');
      await asAdmin();
    });
    await t.test('email changes retain identity; reusing the old email cannot take the owner role',async()=>{
      await claims({...teacherClaims,email:'owner-changed@example.invalid'});await asClient();
      assert.equal((await db.query('select public.workspace_account() as account')).rows[0].account.id,owner);
      await claims({...teacherClaims,sub:'user_recycledQA',sid:'sess_recycledQA'});
      const account=(await db.query('select public.workspace_account() as account')).rows[0].account;
      assert.notEqual(account.id,owner);assert.equal(account.role,'student');
      await assert.rejects(db.query("update public.workspace_members set role='teacher'"),/permission denied/);
      assert.equal((await db.query('select count(*)::int as n from public.teacher_students')).rows[0].n,0);
      await assert.rejects(db.query('select public.lesson_create()'),/Only your teacher/);
      await asAdmin();
    });
    await t.test('student retains the old connection and sees no teacher notes or library',async()=>{
      await claims({...teacherClaims,sub:'user_learnerQA',sid:'sess_learnerQA',email:'learner@example.invalid'});await asClient();
      assert.equal((await db.query('select public.workspace_account() as account')).rows[0].account.id,learner);
      const connections=(await db.query('select public.student_connections() as connections')).rows[0].connections;
      assert.equal(connections.length,1);assert.equal(connections[0].student_name,'Learner');
      assert.equal((await db.query('select count(*)::int as n from public.lesson_materials')).rows[0].n,0);
      assert.equal((await db.query('select count(*)::int as n from public.teacher_students')).rows[0].n,0);
      await assert.rejects(db.query('select * from lesson_private.accounts'),/permission denied/);
      await asAdmin();
    });
    await t.test('new invitations use the current verified Clerk email and retain explicit acceptance',async()=>{
      await db.query("insert into public.teacher_students(id,owner_id,full_name,email,notes) values('d2000000-0000-4000-8000-000000000002',$1,'New learner','new-learner@example.invalid','HIDDEN NEW NOTE')",[owner]);
      await claims({...teacherClaims,email:'owner-changed@example.invalid'});await asClient();
      const invitation=(await db.query("select public.student_invitation_create('d2000000-0000-4000-8000-000000000002',1) as result")).rows[0].result;
      assert.ok(invitation.token);
      const newClaims={...teacherClaims,sub:'user_newLearnerQA',sid:'sess_newLearnerQA',email:'new-learner@example.invalid'};
      await claims(newClaims);
      const account=(await db.query('select public.workspace_account() as account')).rows[0].account;
      assert.equal(account.role,'student');
      assert.equal((await db.query('select public.student_connections() as connections')).rows[0].connections.length,0);
      const accepted=(await db.query('select public.student_invitation_accept($1) as result',[invitation.token])).rows[0].result;
      assert.equal(accepted.connected,true);
      // The stored email still matches, but a refreshed Clerk token does not.
      await claims({...newClaims,email:'changed-learner@example.invalid'});
      await assert.rejects(db.query('select public.student_invitation_read($1)',[invitation.token]),/email address your teacher invited/);
      assert.equal((await db.query('select public.student_connections() as connections')).rows[0].connections.length,1);
      await asAdmin();
    });
    await t.test('shared lessons still require the account role and the matching invitation capability',async()=>{
      await claims(teacherClaims);await asClient();
      const session=(await db.query('select public.lesson_create() as session')).rows[0].session;
      await db.query("select set_config('request.headers',$1,false)",[JSON.stringify({'x-lesson-token':session.teacher_token})]);
      assert.equal((await db.query('select public.lesson_read($1,-1) as session',[session.id])).rows[0].session.role,'teacher');
      await claims({...teacherClaims,sub:'user_learnerQA',sid:'sess_learnerQA',email:'learner@example.invalid'});
      await assert.rejects(db.query('select public.lesson_read($1,-1)',[session.id]),/Invalid or missing lesson invitation/);
      await db.query("select set_config('request.headers',$1,false)",[JSON.stringify({'x-lesson-token':session.student_token})]);
      assert.equal((await db.query('select public.lesson_read($1,-1) as session',[session.id])).rows[0].session.role,'student');
      await db.query("select set_config('request.headers','{}',false)");
      await assert.rejects(db.query('select public.lesson_read($1,-1)',[session.id]),/Invalid or missing lesson invitation/);
      await asAdmin();
    });
    await t.test('anonymous callers cannot provision accounts or read the library',async()=>{
      await claims({});await db.exec('set role anon');
      await assert.rejects(db.query('select public.workspace_account()'),/permission denied/);
      await assert.rejects(db.query('select * from public.lesson_materials'),/permission denied/);
      await asAdmin();
    });
  } finally {await db.close();}
});
