-- Run in a transaction; no accounts, invitations or email messages survive.
begin;
insert into lesson_private.workspace_owner(singleton,email) values(true,'owner-role-qa@example.invalid')
on conflict(singleton) do update set email=excluded.email,user_id=null;
insert into auth.users(id,aud,role,email,raw_user_meta_data) values
('a77ef0ec-745e-4c38-a407-f78ba485d701','authenticated','authenticated','owner-role-qa@example.invalid','{"role":"teacher"}');
do $$ begin
 if exists(select 1 from public.workspace_members where user_id='a77ef0ec-745e-4c38-a407-f78ba485d701') then raise exception 'Unconfirmed owner received access';end if;
end $$;
update auth.users set email_confirmed_at=now() where id='a77ef0ec-745e-4c38-a407-f78ba485d701';
insert into auth.users(id,aud,role,email,email_confirmed_at,raw_user_meta_data) values
('a77ef0ec-745e-4c38-a407-f78ba485d702','authenticated','authenticated','student-role-qa@example.invalid',now(),'{"role":"teacher","email":"owner-role-qa@example.invalid"}');
-- Once claimed, changing a teacher's email never releases their role to another account.
update auth.users set email='owner-changed-qa@example.invalid' where id='a77ef0ec-745e-4c38-a407-f78ba485d701';
insert into auth.users(id,aud,role,email,email_confirmed_at) values
('a77ef0ec-745e-4c38-a407-f78ba485d703','authenticated','authenticated','owner-role-qa@example.invalid',now());
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"a77ef0ec-745e-4c38-a407-f78ba485d701","role":"authenticated"}',true);
do $$ declare s jsonb; begin
 if public.workspace_role()<>'teacher' then raise exception 'Confirmed owner not teacher';end if;
 if (select count(*) from public.workspace_members)<>1 then raise exception 'Membership isolation failed';end if;
 if (select count(*) from public.lesson_materials where owner_id is null)<>30 then raise exception 'Teacher cannot read all 30 lessons';end if;
 insert into public.teacher_students(full_name,notes) values('Auth QA','private teacher note');
 s:=public.lesson_create();
 perform set_config('test.session_id',s->>'id',true);
 perform set_config('test.teacher_token',s->>'teacher_token',true);
 perform set_config('test.student_token',s->>'student_token',true);
 perform set_config('request.headers',jsonb_build_object('x-lesson-token',s->>'teacher_token')::text,true);
 if public.lesson_read((s->>'id')::uuid,-1)->>'role'<>'teacher' then raise exception 'Teacher invitation failed';end if;
end $$;
select set_config('request.jwt.claims','{"sub":"a77ef0ec-745e-4c38-a407-f78ba485d702","role":"authenticated"}',true);
do $$ begin
 if public.workspace_role()<>'student' then raise exception 'Metadata granted teacher role';end if;
 if exists(select 1 from public.lesson_materials) then raise exception 'Student library leaked';end if;
 if exists(select 1 from public.teacher_students) then raise exception 'Teacher notes leaked';end if;
 begin insert into public.workspace_members(user_id,role) values(auth.uid(),'teacher');raise exception 'Self-granted teacher role';exception when insufficient_privilege then null;end;
 begin update public.workspace_members set role='teacher';raise exception 'Self-upgraded role';exception when insufficient_privilege then null;end;
 begin insert into public.teacher_students(full_name) values('Escalated');raise exception 'Student created roster';exception when insufficient_privilege then null;end;
 begin perform public.lesson_create();raise exception 'Student created lesson';exception when sqlstate 'PT403' then null;end;
 begin perform public.lesson_read(current_setting('test.session_id')::uuid,-1);raise exception 'Student used teacher token';exception when sqlstate 'PT403' then null;end;
 perform set_config('request.headers',jsonb_build_object('x-lesson-token',current_setting('test.student_token'))::text,true);
 if public.lesson_read(current_setting('test.session_id')::uuid,-1)->>'role'<>'student' then raise exception 'Student invitation failed';end if;
 perform set_config('request.headers','{}',true);
 begin perform public.lesson_read(current_setting('test.session_id')::uuid,-1);raise exception 'Student opened lesson without invitation';exception when sqlstate 'PT403' then null;end;
end $$;
select set_config('request.jwt.claims','{"sub":"a77ef0ec-745e-4c38-a407-f78ba485d703","role":"authenticated"}',true);
do $$ begin if public.workspace_role()<>'student' then raise exception 'Owner email recycled into teacher role';end if;end $$;
reset role;
set local role anon;
do $$ begin
 begin perform * from public.lesson_materials;raise exception 'Anonymous library leaked';exception when insufficient_privilege then null;end;
 begin perform public.lesson_create();raise exception 'Anonymous created session';exception when insufficient_privilege then null;end;
 begin perform public.lesson_read(current_setting('test.session_id')::uuid,-1);raise exception 'Anonymous read lesson';exception when insufficient_privilege then null;end;
end $$;
reset role;
rollback;
select 'PASS: verified owner claim, immutable role, metadata spoofing, membership isolation, 30 teacher lessons, student restrictions, private notes, invitation roles and anonymous denial; all fixtures rolled back' as result;
