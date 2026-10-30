begin;
insert into auth.users(id,email,email_confirmed_at) values
('f3000000-0000-4000-8000-000000000001','classification-sql@example.invalid',now()),
('f3000000-0000-4000-8000-000000000002','classification-other@example.invalid',now());
update public.workspace_members set role='teacher' where user_id in
('f3000000-0000-4000-8000-000000000001','f3000000-0000-4000-8000-000000000002');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f3000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
insert into public.lesson_materials(id,title,subtitle,level,topic,skills,language_focus,classification_status,legacy_skills,duration,sequence,content)
select 'custom-facet-qa',title,subtitle,level,topic,skills,language_focus,classification_status,legacy_skills,duration,null,content
from public.lesson_materials where id='a1-01';

do $$ declare invalid jsonb; begin
 for invalid in select * from jsonb_array_elements('[
   {"skills":["grammar"]}, {"language_focus":["speaking"]},
   {"skills":["speaking","speaking"]}, {"language_focus":["grammar","grammar"]},
   {"skills":[null]}, {"skills":null}, {"language_focus":null},
   {"skills":[],"language_focus":[]}, {"language_focus":["spelling"]},
   {"legacy_skills":["grammar"]}, {"classification_status":"unknown"},
   {"classification_status":"needs_review","skills":null,"language_focus":null,"legacy_skills":[]},
   {"classification_status":"needs_review","skills":null,"language_focus":null,"legacy_skills":["other"]}
 ]'::jsonb)
 loop
   begin
     update public.lesson_materials set
       skills=case when invalid ? 'skills' then nullif(invalid->'skills','null') else skills end,
       language_focus=case when invalid ? 'language_focus' then nullif(invalid->'language_focus','null') else language_focus end,
       legacy_skills=case when invalid ? 'legacy_skills' then nullif(invalid->'legacy_skills','null') else legacy_skills end,
       classification_status=coalesce(invalid->>'classification_status',classification_status)
       where id='custom-facet-qa';
     raise exception 'Invalid classification accepted: %',invalid;
   exception when check_violation then null;
   end;
 end loop;
 begin
   update public.lesson_materials set content=content||'{"language_focus":["grammar"]}' where id='custom-facet-qa';
   raise exception 'Classification duplicated into content';
 exception when check_violation then null; end;
 if (select array_agg(id order by id) from public.lesson_materials
   where skills @> '["reading"]' and language_focus @> '["spelling_punctuation"]') <> array['a1-07'] then
   raise exception 'Reviewed facets do not combine independently';
 end if;
end $$;

update public.lesson_materials set skills=null,language_focus=null,
  classification_status='needs_review',legacy_skills='["grammar","grammar","spelling"]'
  where id='custom-facet-qa';
do $$ begin
 if not exists(select 1 from public.lesson_materials where id='custom-facet-qa'
   and version=1 and catalogue_version=2 and skills is null and language_focus is null
   and legacy_skills='["grammar","grammar","spelling"]') then
   raise exception 'Unreviewed state lost legacy evidence or changed teaching revision';
 end if;
end $$;

update public.lesson_materials set skills='[]',language_focus='["grammar"]',
  classification_status='reviewed',legacy_skills=null where id='custom-facet-qa';
do $$ begin
 if not exists(select 1 from public.lesson_materials where id='custom-facet-qa'
   and version=1 and catalogue_version=3 and skills='[]' and language_focus='["grammar"]') then
   raise exception 'Reviewed empty Skills was not distinct from unreviewed';
 end if;
end $$;
update public.lesson_materials set language_focus=language_focus where id='custom-facet-qa';
do $$ begin
 if (select catalogue_version from public.lesson_materials where id='custom-facet-qa')<>3 then
   raise exception 'Identical classification update advanced the catalogue revision';
 end if;
end $$;

select set_config('request.jwt.claims','{"sub":"f3000000-0000-4000-8000-000000000002","role":"authenticated"}',true);
do $$ declare affected integer; begin
 update public.lesson_materials set language_focus='["vocabulary"]' where id='custom-facet-qa';
 get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Foreign classification edited';end if;
 if exists(select 1 from public.lesson_materials where id='custom-facet-qa') then
   raise exception 'Foreign classification read';end if;
end $$;
rollback;
select 'PASS: controlled independent facets, nullable unreviewed state, preserved legacy evidence, catalogue-only revisions and owner RLS' as result;
