alter table public.lesson_materials
  alter column title set not null,
  alter column subtitle set not null,
  alter column level set not null,
  alter column topic set not null,
  alter column skills set not null,
  alter column duration set not null;
alter table public.lesson_materials add constraint material_content_sections check (
  content->'schemaVersion'='1'::jsonb and
  jsonb_typeof(content->'vocabulary')='array' and jsonb_array_length(content->'vocabulary') between 3 and 20 and
  jsonb_typeof(content->'practice')='array' and jsonb_array_length(content->'practice') between 1 and 6 and
  jsonb_typeof(content->'retrieval')='array' and jsonb_array_length(content->'retrieval') between 2 and 8 and
  jsonb_typeof(content->'exit')='array' and jsonb_array_length(content->'exit') between 2 and 6 and
  jsonb_typeof(content->'teacherNotes')='array' and jsonb_array_length(content->'teacherNotes') between 1 and 8 and
  jsonb_typeof(content->'language')='object' and jsonb_typeof(content->'input')='object' and
  jsonb_typeof(content->'speaking')='object' and jsonb_typeof(content->'writing')='object' and jsonb_typeof(content->'homework')='object'
);
alter table public.lesson_materials add constraint material_sequence_range check(sequence is null or sequence between 1 and 999);
