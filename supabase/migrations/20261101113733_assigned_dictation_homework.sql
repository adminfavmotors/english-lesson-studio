-- A distinct dictation content contract; existing schema-2 lessons are unchanged.
create function lesson_private.valid_dictation_content(c jsonb) returns boolean
language plpgsql immutable set search_path='' as $$
declare sentence jsonb; token text; total integer:=0;
begin
  if c is null or jsonb_typeof(c) is distinct from 'object' or c->'schemaVersion' is distinct from '3'::jsonb or c->>'kind' is distinct from 'dictation'
    or not c ?& array['goal','instruction','sentences','audioUrl','teacherNotes']
    or jsonb_typeof(c->'goal')<>'string' or length(btrim(c->>'goal')) not between 1 and 300
    or jsonb_typeof(c->'instruction')<>'string' or length(btrim(c->>'instruction')) not between 1 and 1500
    or jsonb_typeof(c->'sentences')<>'array' or jsonb_typeof(c->'teacherNotes')<>'array'
  then return false; end if;
  if jsonb_array_length(c->'sentences') not between 1 and 30 or jsonb_array_length(c->'teacherNotes') not between 1 and 8 then return false; end if;
  if c->'audioUrl'<>'null'::jsonb and (jsonb_typeof(c->'audioUrl')<>'string' or length(c->>'audioUrl')>2000 or c->>'audioUrl' !~ '^(https://|/[^/])') then return false; end if;
  for sentence in select value from jsonb_array_elements(c->'sentences') loop
    if jsonb_typeof(sentence)<>'string' or length(sentence#>>'{}') not between 1 and 500 then return false; end if;
    for token in select unnest(string_to_array(sentence#>>'{}',' ')) loop
      if token !~ '^[A-Za-z’'']+[.,!?;:]*$' then return false; end if;
      total:=total+1;
    end loop;
  end loop;
  if total>500 then return false; end if;
  for sentence in select value from jsonb_array_elements(c->'teacherNotes') loop
    if jsonb_typeof(sentence)<>'string' or length(btrim(sentence#>>'{}')) not between 1 and 2000 then return false; end if;
  end loop;
  return true;
end $$;
revoke all on function lesson_private.valid_dictation_content(jsonb) from public,anon,authenticated;
grant execute on function lesson_private.valid_dictation_content(jsonb) to authenticated;

alter table public.lesson_materials drop constraint material_content_schema, drop constraint material_content_sections;
alter table public.lesson_materials add constraint material_content_schema check (
  jsonb_typeof(content)='object' and octet_length(content::text)<=150000
  and not content ?| array['title','subtitle','level','topic','skills','duration','sequence','language_focus','classification_status','legacy_skills']
  and case when content->'schemaVersion'='2'::jsonb then
    content ?& array['schemaVersion','goal','vocabulary','language','input','retrieval','practice','speaking','writing','exit','homework','teacherNotes']
  when content->'schemaVersion'='3'::jsonb then lesson_private.valid_dictation_content(content) else false end
), add constraint material_content_sections check (
  case when content->'schemaVersion'='2'::jsonb then
    jsonb_typeof(content->'vocabulary')='array' and jsonb_array_length(content->'vocabulary') between 3 and 20 and
    jsonb_typeof(content->'practice')='array' and jsonb_array_length(content->'practice') between 1 and 6 and
    jsonb_typeof(content->'retrieval')='array' and jsonb_array_length(content->'retrieval') between 2 and 8 and
    jsonb_typeof(content->'exit')='array' and jsonb_array_length(content->'exit') between 2 and 6 and
    jsonb_typeof(content->'teacherNotes')='array' and jsonb_array_length(content->'teacherNotes') between 1 and 8 and
    jsonb_typeof(content->'language')='object' and jsonb_typeof(content->'input')='object' and
    jsonb_typeof(content->'speaking')='object' and jsonb_typeof(content->'writing')='object' and jsonb_typeof(content->'homework')='object'
  else true end
);

create table lesson_private.homework (
  id uuid primary key,
  owner_id uuid not null references lesson_private.accounts(id) on delete restrict,
  student_id uuid not null references public.teacher_students(id) on delete restrict,
  student_account_id uuid not null references lesson_private.accounts(id) on delete restrict,
  material_id text not null references public.lesson_materials(id) on delete restrict,
  material_version integer not null check(material_version>0),
  catalogue jsonb not null,
  content jsonb not null check(lesson_private.valid_dictation_content(content)),
  progress jsonb not null default '{}'::jsonb check(jsonb_typeof(progress)='object' and octet_length(progress::text)<=100000),
  version integer not null default 1 check(version>0),
  feedback text not null default '' check(length(feedback)<=3000),
  assigned_at timestamptz not null default now(),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  status text generated always as (case when reviewed_at is not null then 'reviewed' when submitted_at is not null then 'completed' else 'not_completed' end) stored,
  check(reviewed_at is null or submitted_at is not null)
);
alter table lesson_private.homework enable row level security;
revoke all on lesson_private.homework from public,anon,authenticated;
create policy homework_no_direct_access on lesson_private.homework for all to anon,authenticated using(false) with check(false);
create index homework_teacher_student_idx on lesson_private.homework(owner_id,student_id,assigned_at desc,id);
create index homework_student_account_idx on lesson_private.homework(student_account_id,assigned_at desc,id);
create index homework_material_idx on lesson_private.homework(material_id);

-- Grade the actual values against the frozen content, never a client score/status.
create function lesson_private.dictation_result(c jsonb,p jsonb) returns jsonb
language plpgsql immutable set search_path='' as $$
declare sentence jsonb; token text; answer text; key text; attempt jsonb; known text[]:=array[]::text[];
  s integer:=0; w integer; total integer:=0; correct integer:=0; shown integer:=0; hinted integer:=0;
begin
  if p is null or jsonb_typeof(p)<>'object' or octet_length(p::text)>100000 then raise sqlstate 'PT400' using message='Your answers could not be saved. Reload the homework and try again.';end if;
  for sentence in select value from jsonb_array_elements(c->'sentences') loop
    s:=s+1;w:=0;
    for token in select unnest(string_to_array(sentence#>>'{}',' ')) loop
      w:=w+1;total:=total+1;key:='s'||s||'w'||w;known:=array_append(known,key);
      answer:=(regexp_match(token,'^([A-Za-z’'']+)([.,!?;:]*)$'))[1];
      attempt:=p->key;
      if attempt is null then continue;end if;
      if jsonb_typeof(attempt)<>'object' or not attempt ?& array['value','hints','revealed']
        or attempt-array['value','hints','revealed']<>'{}'::jsonb
        or jsonb_typeof(attempt->'value')<>'string' or length(attempt->>'value')>100
        or jsonb_typeof(attempt->'revealed')<>'boolean'
        or jsonb_typeof(attempt->'hints')<>'number' or (attempt->>'hints')!~ '^[0-9]+$'
      then raise sqlstate 'PT400' using message='Some dictation answers are invalid. Reload the homework and try again.';end if;
      if (attempt->>'hints')::numeric>length(answer)-1 then raise sqlstate 'PT400' using message='The hint count is invalid.';end if;
      if (attempt->>'hints')::integer>0 then hinted:=hinted+1;end if;
      if attempt->'revealed'='true'::jsonb then
        if attempt->>'value'<>answer then raise sqlstate 'PT400' using message='A shown word must match the dictation.';end if;
        shown:=shown+1;
      elsif translate(lower(btrim(attempt->>'value')),chr(39)||'’','')=translate(lower(answer),chr(39)||'’','') then correct:=correct+1;
      end if;
    end loop;
  end loop;
  if exists(select 1 from jsonb_object_keys(p) k where not k=any(known)) then raise sqlstate 'PT400' using message='These answers do not belong to this homework.';end if;
  return jsonb_build_object('total',total,'done',correct+shown,'correct',correct,'shown',shown,'hinted',hinted);
end $$;
revoke all on function lesson_private.dictation_result(jsonb,jsonb) from public,anon,authenticated;

create function lesson_private.homework_payload(h lesson_private.homework, include_work boolean default true) returns jsonb
language sql stable set search_path='' as $$
 select jsonb_build_object('id',h.id,'access',case when public.workspace_role()='teacher' then 'teacher' else 'student' end,'student_id',h.student_id,
   'student_name',(select full_name from public.teacher_students where id=h.student_id),
   'material_id',h.material_id,'material_version',h.material_version,'catalogue',h.catalogue,
   'status',h.status,'version',h.version,'feedback',h.feedback,'assigned_at',h.assigned_at,
   'submitted_at',h.submitted_at,'reviewed_at',h.reviewed_at,'result',lesson_private.dictation_result(h.content,h.progress))
   || case when include_work then jsonb_build_object('content',h.content,'progress',h.progress) else '{}'::jsonb end;
$$;
revoke all on function lesson_private.homework_payload(lesson_private.homework,boolean) from public,anon,authenticated;

create function lesson_private.homework_list(p_student_id uuid) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare caller uuid:=lesson_private.current_account_id(); role_name text:=public.workspace_role();
begin
 if caller is null or role_name is null then raise sqlstate 'PT403' using message='Sign in to see your homework.';end if;
 if role_name='teacher' and p_student_id is not null and not exists(select 1 from public.teacher_students where id=p_student_id and owner_id=caller) then raise sqlstate 'PT404' using message='This student profile is unavailable.';end if;
 if role_name='student' and p_student_id is not null then raise sqlstate 'PT403' using message='Open homework from your learning space.';end if;
 return coalesce((select jsonb_agg(lesson_private.homework_payload(h,false) order by h.assigned_at desc,h.id)
 from (select * from lesson_private.homework where
   (role_name='teacher' and owner_id=caller and (p_student_id is null or student_id=p_student_id)) or
   (role_name='student' and student_account_id=caller)
   order by assigned_at desc,id limit 100) h),'[]'::jsonb);
end $$;
revoke all on function lesson_private.homework_list(uuid) from public,anon,authenticated;
grant execute on function lesson_private.homework_list(uuid) to authenticated;

create function lesson_private.homework_action(p_action text,p_id uuid,p_student_id uuid default null,p_material_id text default null,
 p_version integer default null,p_progress jsonb default null,p_feedback text default null) returns jsonb
language plpgsql security definer set search_path='' as $$
declare caller uuid:=lesson_private.current_account_id(); role_name text:=public.workspace_role(); h lesson_private.homework;
 s public.teacher_students; m public.lesson_materials; result jsonb;
begin
 if caller is null or role_name is null then raise sqlstate 'PT403' using message='Sign in to open this homework.';end if;
 if p_action='create' then
  if role_name<>'teacher' then raise sqlstate 'PT403' using message='Only your teacher can assign homework.';end if;
  select * into s from public.teacher_students where id=p_student_id and owner_id=caller for share;
  if not found then raise sqlstate 'PT404' using message='This student profile is unavailable.';end if;
  if s.status='archived' or s.student_user_id is null then raise sqlstate 'PT400' using message='Connect the student’s account and keep their profile active before assigning homework.';end if;
  select * into m from public.lesson_materials where id=p_material_id and (owner_id is null or owner_id=caller) for share;
  if not found then raise sqlstate 'PT404' using message='This lesson is unavailable.';end if;
  if m.content->'schemaVersion' is distinct from '3'::jsonb or m.content->>'kind' is distinct from 'dictation' then raise sqlstate 'PT400' using message='This lesson is not available as assigned homework yet.';end if;
  if not exists(select 1 from public.workspace_members where user_id=s.student_user_id and role='student') then raise sqlstate 'PT400' using message='This profile needs a connected student account.';end if;
  insert into lesson_private.homework(id,owner_id,student_id,student_account_id,material_id,material_version,catalogue,content)
   values(p_id,caller,s.id,s.student_user_id,m.id,m.version,jsonb_build_object('title',m.title,'subtitle',m.subtitle,'level',m.level,'duration',m.duration),m.content)
   on conflict(id) do nothing;
  select * into h from lesson_private.homework where id=p_id for update;
  if h.owner_id<>caller or h.student_id<>s.id or h.material_id<>m.id then raise sqlstate 'PT409' using message='This homework was already assigned by a different request.';end if;
  return lesson_private.homework_payload(h);
 end if;
 select * into h from lesson_private.homework where id=p_id and
   ((role_name='teacher' and owner_id=caller) or (role_name='student' and student_account_id=caller)) for update;
 if not found then raise sqlstate 'PT404' using message='This homework is unavailable for your account.';end if;
 if p_action='get' then return lesson_private.homework_payload(h);end if;
 if p_action in ('save','submit') then
  if role_name<>'student' or h.student_account_id<>caller then raise sqlstate 'PT403' using message='Only the assigned student can send answers.';end if;
  if p_action='submit' and h.submitted_at is not null and h.progress=p_progress then return lesson_private.homework_payload(h);end if;
  if h.submitted_at is not null then raise sqlstate 'PT409' using message='This homework has been sent to your teacher and cannot be changed.';end if;
  if p_action='save' and h.progress=p_progress then return lesson_private.homework_payload(h);end if;
  if h.version is distinct from p_version then raise sqlstate 'PT409' using message='This homework changed on another device. Keep this tab open, copy any unsaved answers, then reload the homework.';end if;
  result:=lesson_private.dictation_result(h.content,p_progress);
  if p_action='submit' and result->>'done'<>result->>'total' then raise sqlstate 'PT400' using message='Finish every word before sending your homework. Use Hint or Show if you are stuck.';end if;
  update lesson_private.homework set progress=p_progress,version=version+1,
   submitted_at=case when p_action='submit' then now() else null end where id=h.id returning * into h;
 elsif p_action='review' then
  if role_name<>'teacher' or h.owner_id<>caller then raise sqlstate 'PT403' using message='Only the assigning teacher can review this homework.';end if;
  if h.submitted_at is null then raise sqlstate 'PT400' using message='Wait for the student to send their homework before reviewing it.';end if;
  if h.reviewed_at is not null and h.feedback=coalesce(p_feedback,'') then return lesson_private.homework_payload(h);end if;
  if h.reviewed_at is not null or h.version is distinct from p_version then raise sqlstate 'PT409' using message='This homework changed. Reload it before saving your review.';end if;
  if p_feedback is null or length(p_feedback)>3000 then raise sqlstate 'PT400' using message='Use no more than 3,000 characters for feedback.';end if;
  update lesson_private.homework set feedback=p_feedback,reviewed_at=now(),version=version+1 where id=h.id returning * into h;
 else raise sqlstate 'PT400' using message='Unknown homework action.';
 end if;
 return lesson_private.homework_payload(h);
end $$;
revoke all on function lesson_private.homework_action(text,uuid,uuid,text,integer,jsonb,text) from public,anon,authenticated;
grant execute on function lesson_private.homework_action(text,uuid,uuid,text,integer,jsonb,text) to authenticated;

create function public.homework_list(p_student_id uuid default null) returns jsonb language sql security invoker set search_path='' as $$ select lesson_private.homework_list(p_student_id); $$;
create function public.homework_create(p_id uuid,p_student_id uuid,p_material_id text) returns jsonb language sql security invoker set search_path='' as $$ select lesson_private.homework_action('create',p_id,p_student_id,p_material_id); $$;
create function public.homework_get(p_id uuid) returns jsonb language sql security invoker set search_path='' as $$ select lesson_private.homework_action('get',p_id); $$;
create function public.homework_save(p_id uuid,p_version integer,p_progress jsonb) returns jsonb language sql security invoker set search_path='' as $$ select lesson_private.homework_action('save',p_id,p_version=>p_version,p_progress=>p_progress); $$;
create function public.homework_submit(p_id uuid,p_version integer,p_progress jsonb) returns jsonb language sql security invoker set search_path='' as $$ select lesson_private.homework_action('submit',p_id,p_version=>p_version,p_progress=>p_progress); $$;
create function public.homework_review(p_id uuid,p_version integer,p_feedback text) returns jsonb language sql security invoker set search_path='' as $$ select lesson_private.homework_action('review',p_id,p_version=>p_version,p_feedback=>p_feedback); $$;
revoke all on function public.homework_list(uuid),public.homework_create(uuid,uuid,text),public.homework_get(uuid),public.homework_save(uuid,integer,jsonb),public.homework_submit(uuid,integer,jsonb),public.homework_review(uuid,integer,text) from public,anon,authenticated;
grant execute on function public.homework_list(uuid),public.homework_create(uuid,uuid,text),public.homework_get(uuid),public.homework_save(uuid,integer,jsonb),public.homework_submit(uuid,integer,jsonb),public.homework_review(uuid,integer,text) to authenticated;
comment on table lesson_private.homework is 'Assigned, versioned dictation snapshots. Only the assigning teacher and connected student can access work through authorised RPCs.';
notify pgrst,'reload schema';
