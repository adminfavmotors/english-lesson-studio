-- Recovery only: never run as a forward migration or during release preparation.
-- Pause material writes and export the CURRENT materials/favourites before use.
-- Works after the catalogue migration alone or after both catalogue migrations.
-- Keep the matching old frontend ready; this transaction does not deploy it.
begin;
lock table public.lesson_materials in access exclusive mode;

do $guard$
begin
  if not exists(select 1 from information_schema.columns where table_schema='public'
    and table_name='lesson_materials' and column_name='catalogue_version') then
    raise exception 'Catalogue separation is not applied; recovery is unnecessary.';
  end if;
  if exists(select 1 from public.lesson_materials where content->'schemaVersion' is distinct from '2'::jsonb) then
    raise exception 'Unexpected teaching format; recover against the current schema instead.';
  end if;
  if (select count(*) from supabase_migrations.schema_migrations where version in ('20261025145629','20261025150301','20261025153544','20261025161256','20261025211851','20261025220643','20261025222251','20261027151758','20261027205743')) <> 9
    or exists(select 1 from supabase_migrations.schema_migrations
      where version not in ('20261025145629','20261025150301','20261025153544','20261025161256','20261025211851','20261025220643','20261025222251','20261027151758','20261027205743')
      and name not in ('separate_material_catalogue','separate_material_facets')) then
    raise exception 'Migration history differs from this release; do not undo later changes.';
  end if;
  if not exists(select 1 from supabase_migrations.schema_migrations where name='separate_material_catalogue')
    or (exists(select 1 from information_schema.columns where table_schema='public'
      and table_name='lesson_materials' and column_name='language_focus') <>
      exists(select 1 from supabase_migrations.schema_migrations where name='separate_material_facets')) then
    raise exception 'Catalogue schema and recorded migrations disagree; reconcile history before recovery.';
  end if;
end;
$guard$;

-- Flatten CURRENT data, not the pre-release snapshot: retain new lessons/edits.
-- Reviewed facets map to the old mixed vocabulary; punctuation uses spelling.
create temporary table catalogue_recovery_rows on commit drop as
select m.id, m.content || jsonb_build_object(
  'schemaVersion',1,'title',m.title,'subtitle',m.subtitle,'level',m.level,
  'topic',m.topic,'duration',m.duration,'sequence',m.sequence,
  'skills',case
    when to_jsonb(m)->>'classification_status'='reviewed' then
      m.skills || coalesce((select jsonb_agg(
        case when entry.value='"spelling_punctuation"'::jsonb then '"spelling"'::jsonb else entry.value end
        order by entry.ordinality)
        from jsonb_array_elements(to_jsonb(m)->'language_focus') with ordinality as entry(value,ordinality)), '[]'::jsonb)
    when to_jsonb(m)->>'classification_status'='needs_review' then to_jsonb(m)->'legacy_skills'
    else m.skills end
) as restored_content
from public.lesson_materials m;

do $size_guard$
begin
  if exists(select 1 from catalogue_recovery_rows
    where octet_length(restored_content::text)>150000 or
      jsonb_typeof(restored_content->'skills') is distinct from 'array' or
      jsonb_array_length(restored_content->'skills') not between 1 and 8) then
    raise exception 'Current material cannot fit the old contract without loss; keep the new schema and repair forward.';
  end if;
end;
$size_guard$;

drop trigger material_revision on public.lesson_materials;
alter table public.lesson_materials
  drop constraint if exists material_content_schema,
  drop constraint if exists material_content_sections,
  drop constraint if exists material_classification,
  drop column search_text,
  drop column title,drop column subtitle,drop column level,drop column topic,
  drop column skills,drop column duration,drop column sequence,
  drop column catalogue_version,
  drop column if exists language_focus,
  drop column if exists classification_status,
  drop column if exists legacy_skills;

-- No revision trigger runs during this format-only conversion.
update public.lesson_materials m set content=r.restored_content
from catalogue_recovery_rows r where r.id=m.id;

alter table public.lesson_materials
  add column title text generated always as ((content ->> 'title'::text)) stored,
  add column subtitle text generated always as ((content ->> 'subtitle'::text)) stored,
  add column level text generated always as ((content ->> 'level'::text)) stored,
  add column topic text generated always as ((content ->> 'topic'::text)) stored,
  add column skills jsonb generated always as ((content -> 'skills'::text)) stored,
  add column duration integer generated always as (((content ->> 'duration'::text))::integer) stored,
  add column sequence integer generated always as (((content ->> 'sequence'::text))::integer) stored,
  add column search_text text generated always as (((((COALESCE((content ->> 'title'::text), ''::text) || ' '::text) || COALESCE((content ->> 'subtitle'::text), ''::text)) || ' '::text) || COALESCE((content ->> 'topic'::text), ''::text))) stored;

alter table public.lesson_materials
  alter column title set not null,
  alter column subtitle set not null,
  alter column level set not null,
  alter column topic set not null,
  alter column skills set not null,
  alter column duration set not null,
  add constraint lesson_materials_check CHECK ((((length(btrim(title)) >= 1) AND (length(btrim(title)) <= 300)) AND ((length(subtitle) >= 1) AND (length(subtitle) <= 300)) AND ((length(topic) >= 1) AND (length(topic) <= 300)))),
  add constraint lesson_materials_check1 CHECK (((level = ANY (ARRAY['A1'::text, 'A2'::text, 'B1'::text, 'B2'::text, 'C1'::text, 'C2'::text])) AND ((duration >= 15) AND (duration <= 180)))),
  add constraint lesson_materials_content_check CHECK (((jsonb_typeof(content) = 'object'::text) AND ((content ->> 'schemaVersion'::text) = '1'::text) AND (octet_length((content)::text) <= 150000))),
  add constraint lesson_materials_content_check1 CHECK ((content ?& ARRAY['title'::text, 'subtitle'::text, 'level'::text, 'topic'::text, 'skills'::text, 'duration'::text, 'sequence'::text, 'goal'::text, 'vocabulary'::text, 'language'::text, 'input'::text, 'retrieval'::text, 'practice'::text, 'speaking'::text, 'writing'::text, 'exit'::text, 'homework'::text, 'teacherNotes'::text])),
  add constraint lesson_materials_skills_check CHECK (((jsonb_typeof(skills) = 'array'::text) AND ((jsonb_array_length(skills) >= 1) AND (jsonb_array_length(skills) <= 8)) AND (skills <@ '["grammar", "vocabulary", "reading", "listening", "speaking", "writing", "spelling", "pronunciation"]'::jsonb))),
  add constraint material_content_sections CHECK ((((content -> 'schemaVersion'::text) = '1'::jsonb) AND (jsonb_typeof((content -> 'vocabulary'::text)) = 'array'::text) AND ((jsonb_array_length((content -> 'vocabulary'::text)) >= 3) AND (jsonb_array_length((content -> 'vocabulary'::text)) <= 20)) AND (jsonb_typeof((content -> 'practice'::text)) = 'array'::text) AND ((jsonb_array_length((content -> 'practice'::text)) >= 1) AND (jsonb_array_length((content -> 'practice'::text)) <= 6)) AND (jsonb_typeof((content -> 'retrieval'::text)) = 'array'::text) AND ((jsonb_array_length((content -> 'retrieval'::text)) >= 2) AND (jsonb_array_length((content -> 'retrieval'::text)) <= 8)) AND (jsonb_typeof((content -> 'exit'::text)) = 'array'::text) AND ((jsonb_array_length((content -> 'exit'::text)) >= 2) AND (jsonb_array_length((content -> 'exit'::text)) <= 6)) AND (jsonb_typeof((content -> 'teacherNotes'::text)) = 'array'::text) AND ((jsonb_array_length((content -> 'teacherNotes'::text)) >= 1) AND (jsonb_array_length((content -> 'teacherNotes'::text)) <= 8)) AND (jsonb_typeof((content -> 'language'::text)) = 'object'::text) AND (jsonb_typeof((content -> 'input'::text)) = 'object'::text) AND (jsonb_typeof((content -> 'speaking'::text)) = 'object'::text) AND (jsonb_typeof((content -> 'writing'::text)) = 'object'::text) AND (jsonb_typeof((content -> 'homework'::text)) = 'object'::text))),
  add constraint material_sequence_range CHECK (((sequence IS NULL) OR ((sequence >= 1) AND (sequence <= 999))));

CREATE INDEX lesson_materials_level_sequence ON public.lesson_materials USING btree (level, sequence, id);
CREATE INDEX lesson_materials_skills ON public.lesson_materials USING gin (skills);

CREATE OR REPLACE FUNCTION public.material_revision()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$ begin new.version:=old.version+1;new.updated_at:=now();return new;end; $function$;
revoke all on function public.material_revision() from public,anon,authenticated;
create trigger material_revision before update on public.lesson_materials
for each row execute function public.material_revision();
grant insert(id,content) on public.lesson_materials to authenticated;
grant update(content) on public.lesson_materials to authenticated;

-- Preserve all nine baseline migrations. Provider-generated timestamps may
-- differ from local filenames; the two agreed migration names are authoritative.
delete from supabase_migrations.schema_migrations
where name in ('separate_material_catalogue','separate_material_facets');
commit;
