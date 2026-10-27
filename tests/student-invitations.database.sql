-- Synthetic fixtures only; the complete suite rolls back.
begin;
create function pg_temp.invitation_denied(statement text, expected_state text) returns void
language plpgsql security invoker as $$
begin
  begin
    execute statement;
    raise exception 'Expected denial: %', statement;
  exception when others then
    if sqlstate<>expected_state then raise; end if;
  end;
end $$;

insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values
('b0000000-0000-4000-8000-000000000001','invite-teacher@example.invalid',now(),'{}'),
('b0000000-0000-4000-8000-000000000002','other-teacher@example.invalid',now(),'{}'),
('b0000000-0000-4000-8000-000000000003','learner@example.invalid',now(),'{}'),
('b0000000-0000-4000-8000-000000000004','other@example.invalid',now(),'{"email":"learner@example.invalid","role":"teacher"}'),
('b0000000-0000-4000-8000-000000000005','learner@example.invalid',null,'{}');
update public.workspace_members set role='teacher' where user_id in ('b0000000-0000-4000-8000-000000000001','b0000000-0000-4000-8000-000000000002');
-- Even an accidentally provisioned membership cannot bypass confirmed email.
insert into public.workspace_members(user_id,role) values('b0000000-0000-4000-8000-000000000005','student');
insert into public.teacher_students(id,owner_id,full_name,email,notes) values
('b1000000-0000-4000-8000-000000000001','b0000000-0000-4000-8000-000000000001','Invited learner','Learner@example.invalid','private teacher note'),
('b1000000-0000-4000-8000-000000000002','b0000000-0000-4000-8000-000000000001','Duplicate profile','learner@example.invalid','private duplicate note'),
('b1000000-0000-4000-8000-000000000003','b0000000-0000-4000-8000-000000000002','Another teacher learner','learner@example.invalid','other teacher note'),
('b1000000-0000-4000-8000-000000000004','b0000000-0000-4000-8000-000000000001','No email','','');

set local role anon;
select pg_temp.invitation_denied($q$select public.student_invitation_create('b1000000-0000-4000-8000-000000000001',1)$q$,'42501');
select pg_temp.invitation_denied($q$select public.student_invitation_accept(repeat('a',64))$q$,'42501');
select pg_temp.invitation_denied($q$select * from lesson_private.student_invitations$q$,'42501');
reset role;
do $$ declare name text; begin
  foreach name in array array[
    'public.student_invitation_create(uuid,integer)', 'public.student_invitation_status(uuid)',
    'public.student_invitation_revoke(uuid)', 'public.student_invitation_read(text)',
    'public.student_invitation_accept(text)', 'public.student_connections()',
    'lesson_private.student_invitation(text,uuid,text,integer)'
  ] loop
    if has_function_privilege('anon',name,'execute') then raise exception 'Anonymous function access: %',name; end if;
  end loop;
  if has_column_privilege('authenticated','public.teacher_students','student_user_id','insert')
    or has_column_privilege('authenticated','public.teacher_students','student_user_id','update')
    or has_column_privilege('authenticated','public.teacher_students','connected_at','insert')
    or has_column_privilege('authenticated','public.teacher_students','connected_at','update') then
    raise exception 'Client can forge account connection columns';
  end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000001"}',true);
select pg_temp.invitation_denied($q$select public.student_invitation_create('b1000000-0000-4000-8000-000000000003',1)$q$,'PT404');
select pg_temp.invitation_denied($q$select public.student_invitation_revoke('b1000000-0000-4000-8000-000000000003')$q$,'PT404');
select pg_temp.invitation_denied($q$select public.student_invitation_create('b1000000-0000-4000-8000-000000000004',1)$q$,'PT400');
select pg_temp.invitation_denied($q$update public.teacher_students set student_user_id='b0000000-0000-4000-8000-000000000003'$q$,'42501');
select pg_temp.invitation_denied($q$select public.student_invitation_create('b1000000-0000-4000-8000-000000000001',999)$q$,'PT409');

do $$ declare invitation jsonb; begin
  invitation:=public.student_invitation_create('b1000000-0000-4000-8000-000000000001',1);
  if invitation->>'status'<>'pending' or invitation->>'email'<>'learner@example.invalid' then raise exception 'Invitation creation failed'; end if;
  if invitation->>'token' !~ '^[0-9a-f]{64}$' then raise exception 'Token is not 256 bits'; end if;
  perform set_config('test.invite',invitation->>'token',true);
  if public.student_invitation_status('b1000000-0000-4000-8000-000000000001') ? 'token' then raise exception 'Raw token leaked on read'; end if;
end $$;

select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000004"}',true);
select pg_temp.invitation_denied($q$select public.student_invitation_read(current_setting('test.invite'))$q$,'PT403');
select pg_temp.invitation_denied($q$select public.student_invitation_accept(current_setting('test.invite'))$q$,'PT403');
select pg_temp.invitation_denied($q$select public.student_invitation_create('b1000000-0000-4000-8000-000000000001',1)$q$,'PT403');
select pg_temp.invitation_denied($q$select * from lesson_private.student_invitations$q$,'42501');
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000005"}',true);
select pg_temp.invitation_denied($q$select public.student_invitation_accept(current_setting('test.invite'))$q$,'PT403');

-- Replacement, revocation, expiry, email edit and archive each invalidate a link.
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000001"}',true);
select set_config('test.replacement',public.student_invitation_create('b1000000-0000-4000-8000-000000000001',1)->>'token',true);
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000003"}',true);
select pg_temp.invitation_denied($q$select public.student_invitation_accept(current_setting('test.invite'))$q$,'PT404');
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000001"}',true);
select public.student_invitation_revoke('b1000000-0000-4000-8000-000000000001');
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000003"}',true);
select pg_temp.invitation_denied($q$select public.student_invitation_accept(current_setting('test.replacement'))$q$,'PT404');
reset role;
update lesson_private.student_invitations set revoked=false,expires_at=now()-interval '1 second';
set local role authenticated;
select pg_temp.invitation_denied($q$select public.student_invitation_accept(current_setting('test.replacement'))$q$,'PT404');
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000001"}',true);
select set_config('test.invite',public.student_invitation_create('b1000000-0000-4000-8000-000000000001',1)->>'token',true);
update public.teacher_students set email='changed@example.invalid' where id='b1000000-0000-4000-8000-000000000001';
update public.teacher_students set email='learner@example.invalid' where id='b1000000-0000-4000-8000-000000000001';
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000003"}',true);
select pg_temp.invitation_denied($q$select public.student_invitation_accept(current_setting('test.invite'))$q$,'PT404');
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000001"}',true);
select set_config('test.invite',public.student_invitation_create('b1000000-0000-4000-8000-000000000001',3)->>'token',true);
update public.teacher_students set status='archived' where id='b1000000-0000-4000-8000-000000000001';
update public.teacher_students set status='active' where id='b1000000-0000-4000-8000-000000000001';
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000003"}',true);
select pg_temp.invitation_denied($q$select public.student_invitation_accept(current_setting('test.invite'))$q$,'PT404');

select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000001"}',true);
select set_config('test.invite',public.student_invitation_create('b1000000-0000-4000-8000-000000000001',5)->>'token',true);
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000003"}',true);
do $$ declare preview jsonb; begin
  preview:=public.student_invitation_read(current_setting('test.invite'));
  if preview->>'student_name'<>'Invited learner' or preview->>'connected'<>'false' then raise exception 'Preview failed'; end if;
  if preview ? 'notes' or preview ? 'email' or preview ? 'owner_id' then raise exception 'Private profile leaked'; end if;
  if public.student_invitation_accept(current_setting('test.invite'))->>'connected'<>'true' then raise exception 'Acceptance failed'; end if;
  if public.student_invitation_accept(current_setting('test.invite'))->>'connected'<>'true' then raise exception 'Idempotent acceptance failed'; end if;
  if exists(select 1 from public.teacher_students) then raise exception 'Student can read teacher notes'; end if;
  if exists(select 1 from public.lesson_materials) then raise exception 'Student library access changed'; end if;
  if public.workspace_role()<>'student' then raise exception 'Invitation changed membership'; end if;
  if jsonb_array_length(public.student_connections())<>1 then raise exception 'Connection missing'; end if;
  if public.student_connections()->0 ? 'notes' then raise exception 'Connection returned private notes'; end if;
end $$;
select pg_temp.invitation_denied($q$select public.student_invitation_read('broken')$q$,'PT404');
select pg_temp.invitation_denied($q$select public.student_invitation_accept(repeat('0',64))$q$,'PT404');
select pg_temp.invitation_denied($q$select public.student_invitation_status('b1000000-0000-4000-8000-000000000001')$q$,'PT403');
-- A new UID with the same confirmed address cannot steal the existing link.
reset role;
update auth.users set email_confirmed_at=now() where id='b0000000-0000-4000-8000-000000000005';
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000005"}',true);
select pg_temp.invitation_denied($q$select public.student_invitation_accept(current_setting('test.invite'))$q$,'PT409');

-- One account cannot consume two cards from the same teacher.
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000001"}',true);
select pg_temp.invitation_denied($q$select public.student_invitation_create('b1000000-0000-4000-8000-000000000001',6)$q$,'PT409');
select set_config('test.duplicate',public.student_invitation_create('b1000000-0000-4000-8000-000000000002',1)->>'token',true);
do $$ begin
  if public.student_invitation_status('b1000000-0000-4000-8000-000000000001')->>'status'<>'connected' then raise exception 'Teacher cannot see connection'; end if;
end $$;
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000003"}',true);
select pg_temp.invitation_denied($q$select public.student_invitation_accept(current_setting('test.duplicate'))$q$,'PT409');
-- The same student may learn with a second teacher.
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000002"}',true);
select set_config('test.second_teacher',public.student_invitation_create('b1000000-0000-4000-8000-000000000003',1)->>'token',true);
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000003"}',true);
select public.student_invitation_accept(current_setting('test.second_teacher'));
do $$ begin if jsonb_array_length(public.student_connections())<>2 then raise exception 'Second teacher connection failed'; end if; end $$;

select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000001"}',true);
update public.teacher_students set email='contact-only@example.invalid' where id='b1000000-0000-4000-8000-000000000001';
reset role;
do $$ begin
  if (select student_user_id from public.teacher_students where id='b1000000-0000-4000-8000-000000000001')<>'b0000000-0000-4000-8000-000000000003' then raise exception 'Contact edit reassigned account'; end if;
  if (select notes from public.teacher_students where id='b1000000-0000-4000-8000-000000000001')<>'private teacher note' then raise exception 'Notes changed'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"b0000000-0000-4000-8000-000000000004"}',true);
do $$ begin if public.student_connections()<>'[]'::jsonb then raise exception 'Connections leaked to other student'; end if; end $$;
reset role;
rollback;
select 'PASS: invited identity, confirmation, ownership, token replacement/revocation/expiry, archive and email changes, repeat acceptance, uniqueness and private-note isolation; fixtures rolled back' as result;
