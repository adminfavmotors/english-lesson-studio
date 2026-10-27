-- Trusted roles are created by Auth, never by browser-supplied metadata.
create table public.workspace_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('teacher','student')),
  created_at timestamptz not null default now()
);
alter table public.workspace_members enable row level security;
revoke all on public.workspace_members from public,anon,authenticated;
grant select on public.workspace_members to authenticated;
create policy membership_self_read on public.workspace_members for select to authenticated using(user_id=(select auth.uid()));

create table lesson_private.workspace_owner (
  singleton boolean primary key default true check(singleton),
  email text not null check(email=lower(btrim(email))),
  user_id uuid unique references auth.users(id) on delete restrict
);
alter table lesson_private.workspace_owner enable row level security;
revoke all on lesson_private.workspace_owner from public,anon,authenticated;
create policy owner_no_client_access on lesson_private.workspace_owner for all to anon,authenticated using(false) with check(false);
-- Provision the reserved owner email through an administrative SQL operation.
-- Keep the actual address out of the public repository and client bundle.
create function lesson_private.provision_workspace_member() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.email_confirmed_at is null then return new; end if;
  update lesson_private.workspace_owner set user_id=new.id
    where email=lower(new.email) and user_id is null;
  insert into public.workspace_members(user_id,role)
    values(new.id,case when exists(select 1 from lesson_private.workspace_owner where user_id=new.id) then 'teacher' else 'student' end)
    on conflict(user_id) do nothing;
  return new;
end $$;
revoke all on function lesson_private.provision_workspace_member() from public,anon,authenticated;
create trigger provision_workspace_member after insert or update of email,email_confirmed_at on auth.users
for each row execute function lesson_private.provision_workspace_member();
insert into public.workspace_members(user_id,role) select id,'student' from auth.users where email_confirmed_at is not null;

create function public.workspace_role() returns text language sql stable security invoker set search_path='' as $$
  select role from public.workspace_members where user_id=(select auth.uid());
$$;
revoke all on function public.workspace_role() from public,anon;
grant execute on function public.workspace_role() to authenticated;

drop policy materials_read on public.lesson_materials;
drop policy materials_insert on public.lesson_materials;
drop policy materials_update on public.lesson_materials;
revoke select on public.lesson_materials from anon;
create policy materials_read on public.lesson_materials for select to authenticated
using((select public.workspace_role())='teacher' and (owner_id is null or owner_id=(select auth.uid())));
create policy materials_insert on public.lesson_materials for insert to authenticated
with check((select public.workspace_role())='teacher' and owner_id=(select auth.uid()));
create policy materials_update on public.lesson_materials for update to authenticated
using((select public.workspace_role())='teacher' and owner_id=(select auth.uid()))
with check((select public.workspace_role())='teacher' and owner_id=(select auth.uid()));
alter policy teacher_students_select on public.teacher_students using((select public.workspace_role())='teacher' and owner_id=(select auth.uid()));
alter policy teacher_students_insert on public.teacher_students with check((select public.workspace_role())='teacher' and owner_id=(select auth.uid()));
alter policy teacher_students_update on public.teacher_students using((select public.workspace_role())='teacher' and owner_id=(select auth.uid())) with check((select public.workspace_role())='teacher' and owner_id=(select auth.uid()));
alter policy favourites_read on public.material_favourites using((select public.workspace_role())='teacher' and owner_id=(select auth.uid()));
alter policy favourites_delete on public.material_favourites using((select public.workspace_role())='teacher' and owner_id=(select auth.uid()));
alter policy favourites_insert on public.material_favourites with check((select public.workspace_role())='teacher' and owner_id=(select auth.uid()) and exists(select 1 from public.lesson_materials m where m.id=material_id));

-- Invitation capabilities remain scoped to one lesson. Teacher capabilities
-- additionally require a trusted teacher account; a URL cannot grant that role.
create or replace function lesson_private.session_role(s lesson_private.sessions) returns text
language plpgsql stable set search_path='' as $$
declare token text:=coalesce(nullif(current_setting('request.headers',true),'')::jsonb->>'x-lesson-token','');
  account_role text:=public.workspace_role();
begin
  if auth.uid() is null or account_role is null then raise sqlstate 'PT403' using message='Sign in to open this lesson.';end if;
  if token !~ '^[0-9a-f]{64}$' then raise sqlstate 'PT403' using message='Invalid or missing lesson invitation.';end if;
  if extensions.digest(token,'sha256')=s.teacher_hash and account_role='teacher' then return 'teacher';end if;
  if extensions.digest(token,'sha256')=s.student_hash then return 'student';end if;
  raise sqlstate 'PT403' using message='Invalid or missing lesson invitation.';
end $$;
revoke execute on function public.lesson_create(), public.lesson_read(uuid,bigint), public.lesson_write(uuid,uuid,text,jsonb,jsonb,text) from public,anon;
revoke execute on function lesson_private.new_session(), lesson_private.read_session(uuid,bigint), lesson_private.write_session(uuid,uuid,text,jsonb,jsonb,text) from public,anon;
grant execute on function public.lesson_create(), public.lesson_read(uuid,bigint), public.lesson_write(uuid,uuid,text,jsonb,jsonb,text) to authenticated;
create or replace function public.lesson_create() returns jsonb language plpgsql security invoker set search_path='' as $$
begin
  if auth.uid() is null or public.workspace_role() is distinct from 'teacher' then raise sqlstate 'PT403' using message='Only your teacher can create a lesson.';end if;
  return lesson_private.new_session();
end $$;
-- The underlying creator also checks the role (including direct schema calls).
create function lesson_private.require_teacher_session() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if auth.uid() is null or public.workspace_role() is distinct from 'teacher' then raise sqlstate 'PT403' using message='Only your teacher can create a lesson.';end if;
  return new;
end $$;
revoke all on function lesson_private.require_teacher_session() from public,anon,authenticated;
create trigger require_teacher_session before insert on lesson_private.sessions for each row execute function lesson_private.require_teacher_session();
comment on table public.workspace_members is 'Server-managed account roles. Clients can read only their own membership.';
comment on table public.lesson_materials is 'Private teaching library: shared studio collection and teacher-owned imports. Students join assigned lessons using invitations.';
