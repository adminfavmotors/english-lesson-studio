-- Preserve material IDs, teaching revisions, timestamps and existing draft keys.
-- The catalogue columns become the only stored source of their descriptions.
drop trigger material_revision on public.lesson_materials;

alter table public.lesson_materials
  alter column title drop expression,
  alter column subtitle drop expression,
  alter column level drop expression,
  alter column topic drop expression,
  alter column skills drop expression,
  alter column duration drop expression,
  alter column sequence drop expression,
  drop column search_text,
  drop constraint lesson_materials_content_check,
  drop constraint lesson_materials_content_check1,
  drop constraint material_content_sections,
  add column catalogue_version integer not null default 1 check (catalogue_version > 0);

update public.lesson_materials
set content = jsonb_set(
  content - array['title','subtitle','level','topic','skills','duration','sequence'],
  '{schemaVersion}', '2'::jsonb
);

alter table public.lesson_materials
  add column search_text text generated always as
    (coalesce(title,'') || ' ' || coalesce(subtitle,'') || ' ' || coalesce(topic,'')) stored,
  add constraint material_content_schema check (
    jsonb_typeof(content) = 'object' and content->'schemaVersion' = '2'::jsonb and
    octet_length(content::text) <= 150000 and
    content ?& array['schemaVersion','goal','vocabulary','language','input','retrieval','practice','speaking','writing','exit','homework','teacherNotes'] and
    not content ?| array['title','subtitle','level','topic','skills','duration','sequence']
  ),
  add constraint material_content_sections check (
    jsonb_typeof(content->'vocabulary')='array' and jsonb_array_length(content->'vocabulary') between 3 and 20 and
    jsonb_typeof(content->'practice')='array' and jsonb_array_length(content->'practice') between 1 and 6 and
    jsonb_typeof(content->'retrieval')='array' and jsonb_array_length(content->'retrieval') between 2 and 8 and
    jsonb_typeof(content->'exit')='array' and jsonb_array_length(content->'exit') between 2 and 6 and
    jsonb_typeof(content->'teacherNotes')='array' and jsonb_array_length(content->'teacherNotes') between 1 and 8 and
    jsonb_typeof(content->'language')='object' and jsonb_typeof(content->'input')='object' and
    jsonb_typeof(content->'speaking')='object' and jsonb_typeof(content->'writing')='object' and jsonb_typeof(content->'homework')='object'
  );

create or replace function public.material_revision() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.version := old.version + (new.content is distinct from old.content)::integer;
  new.catalogue_version := old.catalogue_version + (
    row(new.title,new.subtitle,new.level,new.topic,new.skills,new.duration,new.sequence)
    is distinct from
    row(old.title,old.subtitle,old.level,old.topic,old.skills,old.duration,old.sequence)
  )::integer;
  if new is distinct from old then
    new.updated_at := now();
  else
    new.updated_at := old.updated_at;
  end if;
  return new;
end;
$$;
revoke all on function public.material_revision() from public,anon,authenticated;
create trigger material_revision before update on public.lesson_materials
for each row execute function public.material_revision();

-- Existing teacher/owner RLS remains authoritative. Counters and ownership are
-- server-managed; neither the catalogue nor the content can transfer ownership.
grant insert(title,subtitle,level,topic,skills,duration,sequence)
  on public.lesson_materials to authenticated;
grant update(title,subtitle,level,topic,skills,duration,sequence)
  on public.lesson_materials to authenticated;

comment on column public.lesson_materials.version is
  'Teaching-content revision. Catalogue-only changes preserve learner draft keys.';
comment on column public.lesson_materials.catalogue_version is
  'Server-managed catalogue revision, independent of teaching content.';
comment on column public.lesson_materials.content is
  'Schema-2 lesson content without catalogue fields; catalogue columns are authoritative.';
