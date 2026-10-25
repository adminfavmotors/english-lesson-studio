-- Run against the linked project after the teacher_students migration.
-- Everything, including the synthetic auth users, is rolled back.
begin;
insert into auth.users(id,aud,role,email) values
('f81ef0ec-745e-4c38-a407-f78ba485d7a1','authenticated','authenticated','roster-test-a@example.invalid'),
('f81ef0ec-745e-4c38-a407-f78ba485d7a2','authenticated','authenticated','roster-test-b@example.invalid');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f81ef0ec-745e-4c38-a407-f78ba485d7a1","role":"authenticated"}',true);
insert into public.teacher_students(id,full_name,level,notes) values ('f81ef0ec-745e-4c38-a407-f78ba485d7a3','Roster QA','B1','private teacher note');
do $$ begin
  if (select count(*) from public.teacher_students)<>1 then raise exception 'Owner read failed'; end if;
  begin insert into public.teacher_students(full_name,level) values ('Invalid','D9');raise exception 'Invalid level accepted';exception when check_violation then null;end;
  begin insert into public.teacher_students(full_name,status) values ('Invalid','admin');raise exception 'Invalid status accepted';exception when check_violation then null;end;
  begin insert into public.teacher_students(full_name) values ('   ');raise exception 'Blank name accepted';exception when check_violation then null;end;
  begin update public.teacher_students set owner_id='f81ef0ec-745e-4c38-a407-f78ba485d7a2';raise exception 'Owner reassignment accepted';exception when insufficient_privilege then null;end;
end $$;
update public.teacher_students set status='archived' where id='f81ef0ec-745e-4c38-a407-f78ba485d7a3' and version=1;
update public.teacher_students set notes='stale edit' where id='f81ef0ec-745e-4c38-a407-f78ba485d7a3' and version=1;
do $$ begin
  if (select version from public.teacher_students limit 1)<>2 then raise exception 'Revision failed'; end if;
  if (select notes from public.teacher_students limit 1)<>'private teacher note' then raise exception 'Stale update accepted';end if;
end $$;
update public.teacher_students set status='active' where id='f81ef0ec-745e-4c38-a407-f78ba485d7a3' and version=2;
select set_config('request.jwt.claims','{"sub":"f81ef0ec-745e-4c38-a407-f78ba485d7a2","role":"authenticated"}',true);
do $$ begin if (select count(*) from public.teacher_students)<>0 then raise exception 'Cross-account read leak';end if;end $$;
update public.teacher_students set notes='unauthorized' where id='f81ef0ec-745e-4c38-a407-f78ba485d7a3';
reset role;
do $$ begin
  if (select notes from public.teacher_students where id='f81ef0ec-745e-4c38-a407-f78ba485d7a3')<>'private teacher note' then raise exception 'Cross-account write leak';end if;
  if (select status from public.teacher_students where id='f81ef0ec-745e-4c38-a407-f78ba485d7a3')<>'active' then raise exception 'Archive restore failed';end if;
  if has_table_privilege('anon','public.teacher_students','select') or has_table_privilege('authenticated','public.teacher_students','delete') then raise exception 'Unexpected privileges';end if;
end $$;
rollback;
select 'PASS: create, validation, edit, archive, restore, version conflict, owner isolation and anonymous denial; all fixtures rolled back' as result;
