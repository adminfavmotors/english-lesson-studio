-- Teacher-owned roster, independent of textbook exercises and lesson invitations.
create table public.teacher_students (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  full_name text not null check (length(btrim(full_name)) between 1 and 120),
  email text not null default '' check (length(email) <= 254 and (email = '' or email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
  level text not null default '' check (level in ('', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  status text not null default 'active' check (status in ('active', 'trial', 'paused', 'archived')),
  goals text not null default '' check (length(goals) <= 2000),
  notes text not null default '' check (length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1
);
create index teacher_students_owner_status_created on public.teacher_students (owner_id, status, created_at desc, id);
create index teacher_students_owner_level_created on public.teacher_students (owner_id, level, created_at desc, id);
alter table public.teacher_students enable row level security;
revoke all on public.teacher_students from public, anon, authenticated;
grant select on public.teacher_students to authenticated;
grant insert (id, full_name, email, level, status, goals, notes) on public.teacher_students to authenticated;
grant update (full_name, email, level, status, goals, notes) on public.teacher_students to authenticated;
create policy teacher_students_select on public.teacher_students for select to authenticated using (owner_id = (select auth.uid()));
create policy teacher_students_insert on public.teacher_students for insert to authenticated with check (owner_id = (select auth.uid()));
create policy teacher_students_update on public.teacher_students for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create function public.teacher_student_revision() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at := now();
  new.version := old.version + 1;
  return new;
end;
$$;
revoke all on function public.teacher_student_revision() from public, anon, authenticated;
create trigger teacher_students_revision before update on public.teacher_students for each row execute function public.teacher_student_revision();
comment on table public.teacher_students is 'Private teacher roster. Each authenticated account can only read and edit its own students; lesson invitation tokens grant no access.';
