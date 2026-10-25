-- Teacher-controlled lesson details, schedule and whole-lesson timer.
create or replace function lesson_private.write_session(p_id uuid, p_operation uuid, p_action text, p_values jsonb, p_epochs jsonb, p_exercise text)
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
      if key_name like 'lesson.%' then
        if role_name <> 'teacher' then raise sqlstate 'PT403' using message = 'Only the teacher can change student details, the schedule or the lesson timer.'; end if;
        if key_name not in ('lesson.studentName','lesson.studentLevel','lesson.title','lesson.number','lesson.date','lesson.time','lesson.timeZone','lesson.timer.duration','lesson.timer.remaining','lesson.timer.deadline','lesson.timer.state') then
          raise sqlstate 'PT400' using message = 'Unknown lesson setting.';
        end if;
        if key_name in ('lesson.timer.duration','lesson.timer.remaining','lesson.timer.deadline') then
          if jsonb_typeof(field_value) not in ('number','null') then raise sqlstate 'PT400' using message = 'Invalid lesson timer value.'; end if;
          if jsonb_typeof(field_value) = 'number' then
            if (field_value::text)::numeric <> trunc((field_value::text)::numeric) or (field_value::text)::numeric < 0 or (field_value::text)::numeric > 99999999999999 then raise sqlstate 'PT400' using message = 'Invalid lesson timer value.'; end if;
            if key_name = 'lesson.timer.duration' and ((field_value::text)::numeric < 60 or (field_value::text)::numeric > 14400) then raise sqlstate 'PT400' using message = 'Choose a lesson length between 1 and 240 minutes.'; end if;
            if key_name = 'lesson.timer.remaining' and (field_value::text)::numeric > 14400 then raise sqlstate 'PT400' using message = 'Invalid remaining lesson time.'; end if;
          end if;
        else
          if jsonb_typeof(field_value) not in ('string','null') or length(field_value #>> '{}') > 160 then raise sqlstate 'PT400' using message = 'Invalid student or lesson detail.'; end if;
          if key_name = 'lesson.studentName' and length(field_value #>> '{}') > 120 then raise sqlstate 'PT400' using message = 'Student name is too long.'; end if;
          if key_name = 'lesson.number' and length(field_value #>> '{}') > 24 then raise sqlstate 'PT400' using message = 'Lesson number is too long.'; end if;
          if key_name = 'lesson.timer.state' and field_value not in ('null'::jsonb,'"idle"'::jsonb,'"running"'::jsonb,'"paused"'::jsonb,'"finished"'::jsonb) then raise sqlstate 'PT400' using message = 'Invalid lesson timer state.'; end if;
          if key_name = 'lesson.time' and field_value <> 'null'::jsonb and (field_value #>> '{}') !~ '^$|^([01][0-9]|2[0-3]):[0-5][0-9]$' then raise sqlstate 'PT400' using message = 'Invalid lesson time.'; end if;
          if key_name = 'lesson.date' and field_value <> 'null'::jsonb then
            begin
              if (field_value #>> '{}') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' or (field_value #>> '{}')::date < date '1900-01-01' or (field_value #>> '{}')::date > date '2200-12-31' then raise sqlstate 'PT400' using message = 'Invalid lesson date.'; end if;
            exception when invalid_datetime_format or datetime_field_overflow then raise sqlstate 'PT400' using message = 'Invalid lesson date.';
            end;
          end if;
        end if;
      elsif key_name !~ '^ex([1-9]|1[0-4])\.(answer\.[A-Za-z0-9_.]+|complete|checked|deadline|remaining|hidden)$'
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

notify pgrst, 'reload schema';
