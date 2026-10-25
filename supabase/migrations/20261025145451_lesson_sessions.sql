-- One isolated database for English Lesson Studio. There are no user accounts:
-- 256-bit invitation capabilities provide authorization instead of auth.uid().
-- Only hashes of teacher capabilities are kept. The student capability is also
-- retained privately so the teacher can retrieve the invitation on another PC.
create schema lesson_private;
revoke all on schema lesson_private from public, anon, authenticated;
grant usage on schema lesson_private to anon, authenticated;

create table lesson_private.sessions (
  id uuid primary key default gen_random_uuid(),
  teacher_hash bytea not null,
  student_hash bytea not null,
  student_secret text not null,
  fields jsonb not null default '{}'::jsonb,
  epochs jsonb not null default '{}'::jsonb,
  revision bigint not null default 0,
  recent_ops jsonb not null default '[]'::jsonb,
  created_ip_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bounded_document check (octet_length(fields::text) <= 512000)
);
alter table lesson_private.sessions enable row level security;
revoke all on lesson_private.sessions from public, anon, authenticated;
create index lesson_sessions_creation_idx on lesson_private.sessions (created_ip_hash, created_at desc);
comment on table lesson_private.sessions is 'Shared English lessons: one teacher and student invitation per session. Not related to automotive or analytics projects.';

create function lesson_private.session_role(s lesson_private.sessions)
returns text language plpgsql stable security invoker set search_path = '' as $$
declare token text := coalesce(nullif(current_setting('request.headers', true), '')::jsonb ->> 'x-lesson-token', '');
begin
  if token !~ '^[0-9a-f]{64}$' then raise sqlstate 'PT403' using message = 'Invalid or missing lesson invitation.'; end if;
  if extensions.digest(token, 'sha256') = s.teacher_hash then return 'teacher'; end if;
  if extensions.digest(token, 'sha256') = s.student_hash then return 'student'; end if;
  raise sqlstate 'PT403' using message = 'Invalid or missing lesson invitation.';
end;
$$;

create function lesson_private.payload(s lesson_private.sessions, role_name text, known_revision bigint default -1)
returns jsonb language sql volatile security invoker set search_path = '' as $$
  select jsonb_build_object(
    'id', s.id, 'role', role_name, 'revision', s.revision, 'epochs', s.epochs,
    'document', case when s.revision = known_revision then null else jsonb_build_object('version', 1, 'fields', s.fields) end,
    'student_token', case when role_name = 'teacher' then s.student_secret else null end,
    'server_time', (extract(epoch from clock_timestamp()) * 1000)::bigint
  );
$$;

-- Privilege elevation is intentionally isolated in this unexposed schema.
-- Every read/write validates a capability before returning or modifying data.
create function lesson_private.new_session()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  teacher_secret text := encode(extensions.gen_random_bytes(32), 'hex');
  student_secret text := encode(extensions.gen_random_bytes(32), 'hex');
  client_ip text := split_part(coalesce(nullif(current_setting('request.headers', true), '')::jsonb ->> 'x-forwarded-for', 'local'), ',', 1);
  ip_hash text;
  s lesson_private.sessions;
begin
  ip_hash := encode(extensions.digest(client_ip, 'sha256'), 'hex');
  perform pg_advisory_xact_lock(hashtextextended(ip_hash, 0));
  if (select count(*) from lesson_private.sessions where created_ip_hash = ip_hash and created_at > now() - interval '1 day') >= 20 then
    raise sqlstate 'PT429' using message = 'Daily session creation limit reached. Reuse an existing lesson link.';
  end if;
  if (select count(*) from lesson_private.sessions) >= 1000 then
    raise sqlstate 'PT429' using message = 'Session storage limit reached. Contact the lesson owner.';
  end if;
  insert into lesson_private.sessions (teacher_hash, student_hash, student_secret, created_ip_hash)
  values (extensions.digest(teacher_secret,'sha256'), extensions.digest(student_secret,'sha256'), student_secret, ip_hash)
  returning * into s;
  return lesson_private.payload(s, 'teacher') || jsonb_build_object('teacher_token', teacher_secret);
end;
$$;

create function lesson_private.read_session(p_id uuid, p_revision bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare s lesson_private.sessions; role_name text;
begin
  select * into s from lesson_private.sessions where id = p_id;
  if not found then raise sqlstate 'PT403' using message = 'Invalid or missing lesson invitation.'; end if;
  role_name := lesson_private.session_role(s);
  return lesson_private.payload(s, role_name, p_revision);
end;
$$;

create function lesson_private.write_session(p_id uuid, p_operation uuid, p_action text, p_values jsonb, p_epochs jsonb, p_exercise text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  s lesson_private.sessions; role_name text; key_name text; field_value jsonb;
  ex text; next_revision bigint; discarded jsonb := '[]'::jsonb; changed boolean := false;
begin
  select * into s from lesson_private.sessions where id = p_id for update;
  if not found then raise sqlstate 'PT403' using message = 'Invalid or missing lesson invitation.'; end if;
  role_name := lesson_private.session_role(s);
  if s.recent_ops ? p_operation::text then return lesson_private.payload(s, role_name); end if;
  if p_action not in ('patch', 'reset_exercise', 'reset_all') or p_action is null then
    raise sqlstate 'PT400' using message = 'Unknown lesson operation.';
  end if;
  next_revision := s.revision + 1;
  if p_action in ('reset_exercise', 'reset_all') then
    if role_name <> 'teacher' and not (p_action = 'reset_exercise' and p_exercise = 'ex1') then
      raise sqlstate 'PT403' using message = 'Only the teacher can reset this lesson.';
    end if;
    if p_action = 'reset_exercise' and (p_exercise is null or p_exercise !~ '^ex([1-9]|1[0-4])$') then
      raise sqlstate 'PT400' using message = 'Invalid exercise.';
    end if;
    for ex in select 'ex' || generate_series(1,14)::text loop
      if p_action = 'reset_all' or ex = p_exercise then
        s.epochs := jsonb_set(s.epochs, array[ex], to_jsonb(coalesce((s.epochs ->> ex)::bigint,0) + 1));
        for key_name in select jsonb_object_keys(s.fields) loop
          if split_part(key_name,'.',1) = ex then
            s.fields := jsonb_set(s.fields, array[key_name], jsonb_build_object('value',null,'time',next_revision,'writer',p_operation));
          end if;
        end loop;
        s.fields := jsonb_set(s.fields,array[ex || '.complete'],jsonb_build_object('value',false,'time',next_revision,'writer',p_operation));
      end if;
    end loop;
    changed := true;
  else
    if p_values is null or jsonb_typeof(p_values) <> 'object' or octet_length(p_values::text) > 128000
      or p_epochs is null or jsonb_typeof(p_epochs) <> 'object' then
      raise sqlstate 'PT400' using message = 'Invalid lesson changes.';
    end if;
    if (select count(*) from jsonb_object_keys(p_values)) > 100 then
      raise sqlstate 'PT400' using message = 'Too many lesson changes.';
    end if;
    for key_name, field_value in select * from jsonb_each(p_values) loop
      if key_name !~ '^ex([1-9]|1[0-4])\.(answer\.[A-Za-z0-9_.]+|complete|checked|deadline|remaining|hidden)$'
        or length(key_name) > 100 or jsonb_typeof(field_value) not in ('string','number','boolean','null')
        or (jsonb_typeof(field_value) = 'string' and length(field_value #>> '{}') > 8000) then
        raise sqlstate 'PT400' using message = 'Invalid answer. Use at most 8000 characters per field.';
      end if;
      if key_name ~ '\.grade$' then
        if field_value not in ('null'::jsonb, '"correct"'::jsonb, '"improve"'::jsonb) then raise sqlstate 'PT400' using message = 'Invalid grade.'; end if;
        if role_name <> 'teacher' and not (field_value = 'null'::jsonb and p_values ? left(key_name, length(key_name)-6)) then
          raise sqlstate 'PT403' using message = 'Only the teacher can review answers.';
        end if;
      elsif key_name ~ '\.hidden$' and key_name <> 'ex2.hidden' and role_name <> 'teacher' then
        raise sqlstate 'PT403' using message = 'Only the teacher can hide reading text.';
      end if;
      ex := split_part(key_name,'.',1);
      if coalesce(p_epochs ->> ex,'0') <> coalesce(s.epochs ->> ex,'0') then
        if not discarded ? ex then discarded := discarded || to_jsonb(ex); end if;
        continue;
      end if;
      s.fields := jsonb_set(s.fields, array[key_name], jsonb_build_object('value',field_value,'time',next_revision,'writer',p_operation));
      -- Editing an answer invalidates an earlier review, including offline edits.
      if key_name ~ '\.answer\.' and key_name !~ '\.grade$' and not p_values ? (key_name || '.grade') then
        s.fields := jsonb_set(s.fields,array[key_name || '.grade'],jsonb_build_object('value',null,'time',next_revision,'writer',p_operation));
      end if;
      changed := true;
    end loop;
  end if;
  if (select count(*) from jsonb_object_keys(s.fields)) > 512 then raise sqlstate 'PT400' using message = 'Lesson answer limit reached.'; end if;
  s.recent_ops := s.recent_ops || to_jsonb(p_operation::text);
  if jsonb_array_length(s.recent_ops) > 128 then s.recent_ops := s.recent_ops - 0; end if;
  update lesson_private.sessions set fields=s.fields, epochs=s.epochs, revision=case when changed then next_revision else s.revision end,
    recent_ops=s.recent_ops, updated_at=now() where id=p_id returning * into s;
  return lesson_private.payload(s,role_name) || jsonb_build_object('discarded',discarded);
end;
$$;

-- Public HTTP entry points have invoker privileges and no direct table access.
create function public.lesson_create() returns jsonb language sql security invoker set search_path = '' as $$ select lesson_private.new_session(); $$;
create function public.lesson_read(p_id uuid, p_revision bigint default -1) returns jsonb language sql security invoker set search_path = '' as $$ select lesson_private.read_session(p_id,p_revision); $$;
create function public.lesson_write(p_id uuid, p_operation uuid, p_action text, p_values jsonb default '{}'::jsonb, p_epochs jsonb default '{}'::jsonb, p_exercise text default null)
returns jsonb language sql security invoker set search_path = '' as $$ select lesson_private.write_session(p_id,p_operation,p_action,p_values,p_epochs,p_exercise); $$;

revoke execute on all functions in schema lesson_private from public, anon, authenticated;
grant execute on function lesson_private.new_session(), lesson_private.read_session(uuid,bigint), lesson_private.write_session(uuid,uuid,text,jsonb,jsonb,text) to anon, authenticated;
revoke execute on function public.lesson_create(), public.lesson_read(uuid,bigint), public.lesson_write(uuid,uuid,text,jsonb,jsonb,text) from public, anon, authenticated;
grant execute on function public.lesson_create(), public.lesson_read(uuid,bigint), public.lesson_write(uuid,uuid,text,jsonb,jsonb,text) to anon, authenticated;
notify pgrst, 'reload schema';
