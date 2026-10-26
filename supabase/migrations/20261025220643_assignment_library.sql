create table public.lesson_materials (
  id text primary key check (id ~ '^[a-z0-9-]{3,100}$'),
  owner_id uuid default auth.uid() references auth.users(id) on delete cascade,
  content jsonb not null,
  title text generated always as (content->>'title') stored,
  subtitle text generated always as (content->>'subtitle') stored,
  level text generated always as (content->>'level') stored,
  topic text generated always as (content->>'topic') stored,
  skills jsonb generated always as (content->'skills') stored,
  duration integer generated always as ((content->>'duration')::integer) stored,
  sequence integer generated always as ((content->>'sequence')::integer) stored,
  search_text text generated always as (coalesce(content->>'title','')||' '||coalesce(content->>'subtitle','')||' '||coalesce(content->>'topic','')) stored,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(content)='object' and content->>'schemaVersion'='1' and octet_length(content::text)<=150000),
  check (content ?& array['title','subtitle','level','topic','skills','duration','sequence','goal','vocabulary','language','input','retrieval','practice','speaking','writing','exit','homework','teacherNotes']),
  check (length(btrim(title)) between 1 and 300 and length(subtitle) between 1 and 300 and length(topic) between 1 and 300),
  check (level in ('A1','A2','B1','B2','C1','C2') and duration between 15 and 180),
  check (jsonb_typeof(skills)='array' and jsonb_array_length(skills) between 1 and 8 and skills <@ '["grammar","vocabulary","reading","listening","speaking","writing","spelling","pronunciation"]'::jsonb)
);
create index lesson_materials_owner on public.lesson_materials(owner_id);
create index lesson_materials_level_sequence on public.lesson_materials(level,sequence,id);
create index lesson_materials_skills on public.lesson_materials using gin(skills);
alter table public.lesson_materials enable row level security;
revoke all on public.lesson_materials from public,anon,authenticated;
grant select on public.lesson_materials to anon,authenticated;
grant insert(id,content) on public.lesson_materials to authenticated;
grant update(content) on public.lesson_materials to authenticated;
create policy materials_read on public.lesson_materials for select to anon,authenticated using(owner_id is null or owner_id=(select auth.uid()));
create policy materials_insert on public.lesson_materials for insert to authenticated with check(owner_id=(select auth.uid()));
create policy materials_update on public.lesson_materials for update to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
create function public.material_revision() returns trigger language plpgsql security invoker set search_path='' as $$ begin new.version:=old.version+1;new.updated_at:=now();return new;end; $$;
revoke all on function public.material_revision() from public,anon,authenticated;
create trigger material_revision before update on public.lesson_materials for each row execute function public.material_revision();

create table public.material_favourites (
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  material_id text not null references public.lesson_materials(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(owner_id,material_id)
);
create index material_favourites_material on public.material_favourites(material_id);
alter table public.material_favourites enable row level security;
revoke all on public.material_favourites from public,anon,authenticated;
grant select,delete on public.material_favourites to authenticated;
grant insert(material_id) on public.material_favourites to authenticated;
create policy favourites_read on public.material_favourites for select to authenticated using(owner_id=(select auth.uid()));
create policy favourites_insert on public.material_favourites for insert to authenticated with check(owner_id=(select auth.uid()) and exists(select 1 from public.lesson_materials m where m.id=material_id));
create policy favourites_delete on public.material_favourites for delete to authenticated using(owner_id=(select auth.uid()));
comment on table public.lesson_materials is 'Structured lessons: shared studio collection and teacher-owned JSON imports. Shared content is practice material, not a secure exam.';
