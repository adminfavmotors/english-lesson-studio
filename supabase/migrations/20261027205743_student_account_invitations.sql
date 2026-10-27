-- Account links are written only by the invitation RPC, never by roster forms.
alter table public.teacher_students
  add column student_user_id uuid references auth.users(id) on delete restrict,
  add column connected_at timestamptz,
  add constraint student_connection_complete check ((student_user_id is null) = (connected_at is null)),
  add constraint student_account_per_teacher unique(owner_id, student_user_id);

create table lesson_private.student_invitations (
  student_id uuid primary key references public.teacher_students(id) on delete cascade,
  token_hash bytea not null unique,
  email text not null,
  expires_at timestamptz not null,
  revoked boolean not null default false
);
alter table lesson_private.student_invitations enable row level security;
revoke all on lesson_private.student_invitations from public, anon, authenticated;
create policy invitations_no_client_access on lesson_private.student_invitations
  for all to anon, authenticated using(false) with check(false);

-- Changing the intended recipient or archiving the card invalidates pending links.
-- Contact details never reassign an already connected account.
create function lesson_private.invalidate_student_invitation() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if lower(btrim(new.email)) is distinct from lower(btrim(old.email)) or new.status='archived' then
    update lesson_private.student_invitations set revoked=true where student_id=new.id;
  end if;
  return new;
end $$;
revoke all on function lesson_private.invalidate_student_invitation() from public,anon,authenticated;
create trigger invalidate_student_invitation after update of email,status on public.teacher_students
  for each row execute function lesson_private.invalidate_student_invitation();

-- Privileged access is confined to the private schema. Every action checks the
-- current server membership and ownership or confirmed Auth email explicitly.
create function lesson_private.student_invitation(
  p_action text, p_student_id uuid default null, p_token text default null, p_version integer default null
) returns jsonb language plpgsql security definer set search_path='' as $$
declare
  caller uuid := auth.uid();
  account_role text := public.workspace_role();
  account_email text;
  s public.teacher_students;
  invitation lesson_private.student_invitations;
  secret text;
begin
  select lower(btrim(email)) into account_email from auth.users
    where id=caller and email_confirmed_at is not null;
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
revoke all on function lesson_private.student_invitation(text,uuid,text,integer) from public,anon,authenticated;
grant execute on function lesson_private.student_invitation(text,uuid,text,integer) to authenticated;

create function public.student_invitation_create(p_student_id uuid,p_version integer) returns jsonb
language sql security invoker set search_path='' as $$ select lesson_private.student_invitation('create',p_student_id,null,p_version); $$;
create function public.student_invitation_status(p_student_id uuid) returns jsonb
language sql security invoker set search_path='' as $$ select lesson_private.student_invitation('status',p_student_id); $$;
create function public.student_invitation_revoke(p_student_id uuid) returns jsonb
language sql security invoker set search_path='' as $$ select lesson_private.student_invitation('revoke',p_student_id); $$;
create function public.student_invitation_read(p_token text) returns jsonb
language sql security invoker set search_path='' as $$ select lesson_private.student_invitation('read',null,p_token); $$;
create function public.student_invitation_accept(p_token text) returns jsonb
language sql security invoker set search_path='' as $$ select lesson_private.student_invitation('accept',null,p_token); $$;
create function public.student_connections() returns jsonb
language sql security invoker set search_path='' as $$ select lesson_private.student_invitation('connections'); $$;

revoke all on function public.student_invitation_create(uuid,integer),public.student_invitation_status(uuid),
  public.student_invitation_revoke(uuid),public.student_invitation_read(text),public.student_invitation_accept(text),
  public.student_connections() from public,anon,authenticated;
grant execute on function public.student_invitation_create(uuid,integer),public.student_invitation_status(uuid),
  public.student_invitation_revoke(uuid),public.student_invitation_read(text),public.student_invitation_accept(text),
  public.student_connections() to authenticated;
comment on column public.teacher_students.student_user_id is 'Connected only after the invited student confirms their Auth email and accepts. Contact email changes do not reassign this identity.';
notify pgrst, 'reload schema';
