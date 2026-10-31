-- Clerk owns authentication. Internal UUIDs retain every existing ownership link.
-- Configure the exact issuer and app origins administratively before cutover.
create table lesson_private.accounts (
  id uuid primary key default extensions.gen_random_uuid(),
  email text not null default '',
  email_confirmed_at timestamptz,
  clerk_user_id text unique check (clerk_user_id ~ '^user_[A-Za-z0-9]+$'),
  legacy_claimable boolean not null default false,
  check (email=lower(btrim(email)) and length(email)<=254),
  check (not legacy_claimable or clerk_user_id is null)
);
alter table lesson_private.accounts enable row level security;
revoke all on lesson_private.accounts from public,anon,authenticated;
create policy accounts_no_client_access on lesson_private.accounts for all to anon,authenticated using(false) with check(false);
insert into lesson_private.accounts(id,email,email_confirmed_at,legacy_claimable)
  select id,lower(btrim(coalesce(email,''))),email_confirmed_at,coalesce(btrim(email)<>'',false) from auth.users;
create unique index accounts_unclaimed_email on lesson_private.accounts(email) where legacy_claimable;

create table lesson_private.clerk_settings (
  singleton boolean primary key default true check(singleton),
  issuer text not null check(issuer ~ '^https://[a-zA-Z0-9.-]+(/[-a-zA-Z0-9._~]+)*$'),
  allowed_origins text[] not null check(cardinality(allowed_origins)>0)
);
alter table lesson_private.clerk_settings enable row level security;
revoke all on lesson_private.clerk_settings from public,anon,authenticated;
create policy clerk_settings_no_client_access on lesson_private.clerk_settings for all to anon,authenticated using(false) with check(false);

alter table public.workspace_members drop constraint workspace_members_user_id_fkey,
  add constraint workspace_members_user_id_fkey foreign key(user_id) references lesson_private.accounts(id) on delete cascade;
alter table lesson_private.workspace_owner drop constraint workspace_owner_user_id_fkey,
  add constraint workspace_owner_user_id_fkey foreign key(user_id) references lesson_private.accounts(id) on delete restrict;
alter table public.teacher_students drop constraint teacher_students_owner_id_fkey,
  add constraint teacher_students_owner_id_fkey foreign key(owner_id) references lesson_private.accounts(id) on delete cascade;
alter table public.teacher_students drop constraint teacher_students_student_user_id_fkey,
  add constraint teacher_students_student_user_id_fkey foreign key(student_user_id) references lesson_private.accounts(id) on delete restrict;
alter table public.lesson_materials drop constraint lesson_materials_owner_id_fkey,
  add constraint lesson_materials_owner_id_fkey foreign key(owner_id) references lesson_private.accounts(id) on delete cascade;
alter table public.material_favourites drop constraint material_favourites_owner_id_fkey,
  add constraint material_favourites_owner_id_fkey foreign key(owner_id) references lesson_private.accounts(id) on delete cascade;
drop trigger provision_workspace_member on auth.users;
drop function lesson_private.provision_workspace_member();

-- Supabase's third-party Auth integration verifies signatures and expiration.
-- Pin issuer and authorized party too: a different Clerk app grants no access.
-- The email claims must be Clerk built-ins, never unsafe/public user metadata.
create function lesson_private.clerk_session_valid() returns boolean
language sql stable security definer set search_path='' as $$
  select coalesce(
    exists(select 1 from lesson_private.clerk_settings c
      where c.issuer=auth.jwt()->>'iss' and auth.jwt()->>'azp'=any(c.allowed_origins))
    and auth.jwt()->>'role'='authenticated'
    and auth.jwt()->>'sub' ~ '^user_[A-Za-z0-9]+$'
    and auth.jwt()->>'sid' ~ '^sess_[A-Za-z0-9]+$'
    and auth.jwt()->>'sts'='active'
    and auth.jwt()->'email_verified'='true'::jsonb
    and jsonb_typeof(auth.jwt()->'email')='string'
    and length(btrim(auth.jwt()->>'email')) between 3 and 254
    and btrim(auth.jwt()->>'email') ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$', false);
$$;
revoke all on function lesson_private.clerk_session_valid() from public,anon,authenticated;
grant execute on function lesson_private.clerk_session_valid() to authenticated;
create function lesson_private.current_account_id() returns uuid
language sql stable security definer set search_path='' as $$
  select id from lesson_private.accounts
  where lesson_private.clerk_session_valid() and clerk_user_id=auth.jwt()->>'sub';
$$;
revoke all on function lesson_private.current_account_id() from public,anon,authenticated;
grant execute on function lesson_private.current_account_id() to authenticated;
create function lesson_private.current_account_email() returns text
language sql stable security invoker set search_path='' as $$
  select case when lesson_private.current_account_id() is not null then lower(btrim(auth.jwt()->>'email')) end;
$$;
revoke all on function lesson_private.current_account_email() from public,anon,authenticated;
grant execute on function lesson_private.current_account_email() to authenticated;

-- A one-time verified-email migration binds old UUIDs. Once bound, later email
-- changes or another account with that address can never transfer ownership.
create function lesson_private.ensure_workspace_account() returns jsonb
language plpgsql security definer set search_path='' as $$
declare
  subject text := auth.jwt()->>'sub';
  verified_email text := lower(btrim(auth.jwt()->>'email'));
  account_id uuid;
  account_role text;
begin
  if not lesson_private.clerk_session_valid() then
    raise sqlstate 'PT403' using message='Sign in with a confirmed account.';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(subject,0));
  select id into account_id from lesson_private.accounts where clerk_user_id=subject for update;
  if account_id is null then
    select id into account_id from lesson_private.accounts
      where legacy_claimable and email=verified_email for update;
    if account_id is not null then
      update lesson_private.accounts set clerk_user_id=subject,legacy_claimable=false,email_confirmed_at=coalesce(email_confirmed_at,now()) where id=account_id;
    else
      insert into lesson_private.accounts(email,email_confirmed_at,clerk_user_id)
        values(verified_email,now(),subject) returning id into account_id;
    end if;
  end if;
  update lesson_private.accounts set email=verified_email,email_confirmed_at=coalesce(email_confirmed_at,now()) where id=account_id;
  update lesson_private.workspace_owner set user_id=account_id where user_id is null and email=verified_email;
  insert into public.workspace_members(user_id,role)
    values(account_id,case when exists(select 1 from lesson_private.workspace_owner where user_id=account_id) then 'teacher' else 'student' end)
    on conflict(user_id) do nothing;
  select role into account_role from public.workspace_members where user_id=account_id;
  return jsonb_build_object('id',account_id,'email',verified_email,'role',account_role);
end $$;
revoke all on function lesson_private.ensure_workspace_account() from public,anon,authenticated;
grant execute on function lesson_private.ensure_workspace_account() to authenticated;
create function public.workspace_account() returns jsonb language sql security invoker set search_path='' as $$
  select lesson_private.ensure_workspace_account();
$$;
revoke all on function public.workspace_account() from public,anon,authenticated;
grant execute on function public.workspace_account() to authenticated;

alter policy membership_self_read on public.workspace_members using(user_id=(select lesson_private.current_account_id()));
create or replace function public.workspace_role() returns text language sql stable security invoker set search_path='' as $$
  select role from public.workspace_members where user_id=(select lesson_private.current_account_id());
$$;
alter table public.teacher_students alter column owner_id set default lesson_private.current_account_id();
alter table public.lesson_materials alter column owner_id set default lesson_private.current_account_id();
alter table public.material_favourites alter column owner_id set default lesson_private.current_account_id();

alter policy materials_read on public.lesson_materials
using((select public.workspace_role())='teacher' and (owner_id is null or owner_id=(select lesson_private.current_account_id())));
alter policy materials_insert on public.lesson_materials
with check((select public.workspace_role())='teacher' and owner_id=(select lesson_private.current_account_id()));
alter policy materials_update on public.lesson_materials
using((select public.workspace_role())='teacher' and owner_id=(select lesson_private.current_account_id()))
with check((select public.workspace_role())='teacher' and owner_id=(select lesson_private.current_account_id()));
alter policy teacher_students_select on public.teacher_students using((select public.workspace_role())='teacher' and owner_id=(select lesson_private.current_account_id()));
alter policy teacher_students_insert on public.teacher_students with check((select public.workspace_role())='teacher' and owner_id=(select lesson_private.current_account_id()));
alter policy teacher_students_update on public.teacher_students using((select public.workspace_role())='teacher' and owner_id=(select lesson_private.current_account_id())) with check((select public.workspace_role())='teacher' and owner_id=(select lesson_private.current_account_id()));
alter policy favourites_read on public.material_favourites using((select public.workspace_role())='teacher' and owner_id=(select lesson_private.current_account_id()));
alter policy favourites_delete on public.material_favourites using((select public.workspace_role())='teacher' and owner_id=(select lesson_private.current_account_id()));
alter policy favourites_insert on public.material_favourites with check((select public.workspace_role())='teacher' and owner_id=(select lesson_private.current_account_id()) and exists(select 1 from public.lesson_materials m where m.id=material_id));


create or replace function lesson_private.session_role(s lesson_private.sessions) returns text
language plpgsql stable set search_path='' as $$
declare token text:=coalesce(nullif(current_setting('request.headers',true),'')::jsonb->>'x-lesson-token','');
  account_role text:=public.workspace_role();
begin
  if lesson_private.current_account_id() is null or account_role is null then raise sqlstate 'PT403' using message='Sign in to open this lesson.';end if;
  if token !~ '^[0-9a-f]{64}$' then raise sqlstate 'PT403' using message='Invalid or missing lesson invitation.';end if;
  if extensions.digest(token,'sha256')=s.teacher_hash and account_role='teacher' then return 'teacher';end if;
  if extensions.digest(token,'sha256')=s.student_hash then return 'student';end if;
  raise sqlstate 'PT403' using message='Invalid or missing lesson invitation.';
end $$;

create or replace function public.lesson_create() returns jsonb language plpgsql security invoker set search_path='' as $$
begin
  if lesson_private.current_account_id() is null or public.workspace_role() is distinct from 'teacher' then raise sqlstate 'PT403' using message='Only your teacher can create a lesson.';end if;
  return lesson_private.new_session();
end $$;

create or replace function lesson_private.require_teacher_session() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if lesson_private.current_account_id() is null or public.workspace_role() is distinct from 'teacher' then raise sqlstate 'PT403' using message='Only your teacher can create a lesson.';end if;
  return new;
end $$;

create or replace function lesson_private.student_invitation(
  p_action text, p_student_id uuid default null, p_token text default null, p_version integer default null
) returns jsonb language plpgsql security definer set search_path='' as $$
declare
  caller uuid := lesson_private.current_account_id();
  account_role text := public.workspace_role();
  account_email text;
  s public.teacher_students;
  invitation lesson_private.student_invitations;
  secret text;
begin
  account_email := lesson_private.current_account_email();
  if caller is null or account_role is null or account_email is null then
    raise sqlstate 'PT403' using message='Sign in with a confirmed account.';
  end if;

  if p_action='connections' then
    if account_role<>'student' then
      raise sqlstate 'PT403' using message='Use your student account.';
    end if;
    return coalesce((select jsonb_agg(jsonb_build_object('student_id',id,'student_name',full_name,'connected_at',connected_at)
      order by connected_at,id) from public.teacher_students where student_user_id=caller and status<>'archived'), '[]'::jsonb);
  end if;

  if p_action in ('create','status','revoke') then
    if account_role<>'teacher' then
      raise sqlstate 'PT403' using message='Only your teacher can manage invitations.';
    end if;
    select * into s from public.teacher_students where id=p_student_id and owner_id=caller for update;
    if not found then raise sqlstate 'PT404' using message='This student profile is unavailable.'; end if;
    select * into invitation from lesson_private.student_invitations where student_id=s.id;
    if p_action='create' then
      if s.version is distinct from p_version then
        raise sqlstate 'PT409' using message='This profile has changed. Refresh the student list and try again.';
      end if;
      if s.student_user_id is not null then
        raise sqlstate 'PT409' using message='This student already has a connected account.';
      end if;
      if s.status='archived' then
        raise sqlstate 'PT400' using message='Restore this profile before inviting the student.';
      end if;
      if btrim(s.email)='' then
        raise sqlstate 'PT400' using message='Add the student’s email address to their profile before inviting them.';
      end if;
      secret := encode(extensions.gen_random_bytes(32),'hex');
      insert into lesson_private.student_invitations(student_id,token_hash,email,expires_at)
        values(s.id,extensions.digest(secret,'sha256'),lower(btrim(s.email)),now()+interval '7 days')
        on conflict(student_id) do update set token_hash=excluded.token_hash,email=excluded.email,
          expires_at=excluded.expires_at,revoked=false
        returning * into invitation;
    elsif p_action='revoke' then
      update lesson_private.student_invitations set revoked=true where student_id=s.id returning * into invitation;
    end if;
    return jsonb_build_object(
      'status',case when s.student_user_id is not null then 'connected'
        when invitation.student_id is null then 'not-invited'
        when invitation.revoked then 'revoked'
        when invitation.expires_at<=now() then 'expired' else 'pending' end,
      'email',invitation.email,'expires_at',invitation.expires_at,'connected_at',s.connected_at
    ) || case when secret is null then '{}'::jsonb else jsonb_build_object('token',secret) end;
  end if;

  if p_action not in ('read','accept') or p_action is null then
    raise sqlstate 'PT400' using message='Unknown invitation action.';
  end if;
  if account_role<>'student' then raise sqlstate 'PT403' using message='Use your student account.'; end if;
  if p_token is null or p_token !~ '^[0-9a-f]{64}$' then
    raise sqlstate 'PT404' using message='This invitation is unavailable. Ask your teacher for a new link.';
  end if;
  select student_id into p_student_id from lesson_private.student_invitations
    where token_hash=extensions.digest(p_token,'sha256');
  -- Lock the card first, as create/revoke/edit do, then recheck the token.
  select * into s from public.teacher_students where id=p_student_id for update;
  select * into invitation from lesson_private.student_invitations
    where student_id=s.id and token_hash=extensions.digest(p_token,'sha256') for update;
  if s.id is null or invitation.student_id is null or invitation.revoked
    or invitation.expires_at<=now() or s.status='archived'
    or lower(btrim(s.email))<>invitation.email then
    raise sqlstate 'PT404' using message='This invitation is unavailable. Ask your teacher for a new link.';
  end if;
  if account_email<>invitation.email then
    raise sqlstate 'PT403' using message='Sign in with the email address your teacher invited, then reopen this link.';
  end if;
  if s.student_user_id is not null and s.student_user_id<>caller then
    raise sqlstate 'PT409' using message='This student already has a connected account. Contact your teacher.';
  end if;
  if p_action='accept' and s.student_user_id is null then
    begin
      update public.teacher_students set student_user_id=caller,connected_at=now() where id=s.id returning * into s;
    exception when unique_violation then
      raise sqlstate 'PT409' using message='Your account is already connected to another profile with this teacher. Contact your teacher.';
    end;
  end if;
  return jsonb_build_object('student_name',s.full_name,'expires_at',invitation.expires_at,'connected',coalesce(s.student_user_id=caller,false));
end $$;
comment on table lesson_private.accounts is 'Stable internal identities. Legacy email claims are one-time, verified only from a pinned Clerk session.';
comment on table public.workspace_members is 'Server-managed teaching roles keyed by stable internal UUIDs, independent of the authentication provider.';
comment on column public.teacher_students.student_user_id is 'Stable student account linked by explicit invitation acceptance. Clerk email changes never reassign an existing connection.';
notify pgrst, 'reload schema';
