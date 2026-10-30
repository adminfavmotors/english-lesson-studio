begin;
insert into auth.users(id,aud,role,email) values
('f81ef0ec-745e-4c38-a407-f78ba485d7b1','authenticated','authenticated','material-test-a@example.invalid'),
('f81ef0ec-745e-4c38-a407-f78ba485d7b2','authenticated','authenticated','material-test-b@example.invalid');
set local role anon;
do $$ begin begin perform * from public.lesson_materials;raise exception 'Anonymous library leaked';exception when insufficient_privilege then null;end;end $$;
reset role;
insert into public.workspace_members(user_id,role) values
('f81ef0ec-745e-4c38-a407-f78ba485d7b1','teacher'),('f81ef0ec-745e-4c38-a407-f78ba485d7b2','teacher');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f81ef0ec-745e-4c38-a407-f78ba485d7b1","role":"authenticated"}',true);
insert into public.lesson_materials(id,title,subtitle,level,topic,skills,language_focus,classification_status,legacy_skills,duration,sequence,content)
select 'custom-library-qa','Private QA lesson',subtitle,level,topic,skills,language_focus,classification_status,legacy_skills,duration,null,content
from public.lesson_materials where id='a1-01';
insert into public.material_favourites(material_id) values('a1-01'),('custom-library-qa');

do $$ declare affected integer; begin
 if (select count(*) from public.material_favourites)<>2 then raise exception 'Favourite write failed';end if;
 update public.lesson_materials set title='Tampered' where id='a1-01';get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Shared material modified by teacher';end if;
 begin update public.lesson_materials set owner_id=null where id='custom-library-qa';raise exception 'Owner changed';exception when insufficient_privilege then null;end;
 begin insert into public.lesson_materials(id,title,subtitle,level,topic,skills,duration,content)
   select 'custom-bad-qa',title,subtitle,null,topic,skills,duration,content from public.lesson_materials where id='a1-01';
   raise exception 'Null metadata allowed';exception when not_null_violation then null;end;
 begin update public.lesson_materials set catalogue_version=99 where id='custom-library-qa';raise exception 'Catalogue revision spoofed';exception when insufficient_privilege then null;end;
 begin update public.lesson_materials set version=99 where id='custom-library-qa';raise exception 'Content revision spoofed';exception when insufficient_privilege then null;end;
end $$;

update public.lesson_materials set title='Updated private lesson',subtitle='Updated',topic='Updated topic',
 level='A2',skills='["writing"]',duration=30,sequence=5
 where id='custom-library-qa' and catalogue_version=1;
do $$ declare affected integer; begin
 if not exists(select 1 from public.lesson_materials where id='custom-library-qa' and version=1 and catalogue_version=2
   and search_text='Updated private lesson Updated Updated topic') then raise exception 'Catalogue update changed teaching revision or search is stale';end if;
 if (select content from public.lesson_materials where id='custom-library-qa') is distinct from
    (select content from public.lesson_materials where id='a1-01') then raise exception 'Catalogue update changed teaching content';end if;
 update public.lesson_materials set topic='Stale edit' where id='custom-library-qa' and catalogue_version=1;
 get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Stale catalogue edit succeeded';end if;
 begin update public.lesson_materials set content=content||'{"topic":"Duplicate"}' where id='custom-library-qa';
   raise exception 'Duplicate catalogue stored in content';exception when check_violation then null;end;
 begin update public.lesson_materials set content=jsonb_set(content,'{schemaVersion}','1') where id='custom-library-qa';
   raise exception 'Legacy content stored without conversion';exception when check_violation then null;end;
end $$;

update public.lesson_materials set content=jsonb_set(content,'{goal}','"I can give a short written introduction."')
 where id='custom-library-qa' and version=1;
do $$ begin
 if not exists(select 1 from public.lesson_materials where id='custom-library-qa' and version=2 and catalogue_version=2)
 then raise exception 'Teaching edit did not have an independent revision';end if;
end $$;
update public.lesson_materials set content=content,title=title where id='custom-library-qa';
do $$ begin
 if not exists(select 1 from public.lesson_materials where id='custom-library-qa' and version=2 and catalogue_version=2)
 then raise exception 'No-op changed revisions';end if;
end $$;
update public.lesson_materials set title='Both edits',content=jsonb_set(content,'{goal}','"I can check a short introduction."')
 where id='custom-library-qa' and version=2 and catalogue_version=2;
do $$ begin
 if not exists(select 1 from public.lesson_materials where id='custom-library-qa' and version=3 and catalogue_version=3)
 then raise exception 'Combined edit changed the wrong revisions';end if;
end $$;

select set_config('request.jwt.claims','{"sub":"f81ef0ec-745e-4c38-a407-f78ba485d7b2","role":"authenticated"}',true);
do $$ declare affected integer; begin
 if exists(select 1 from public.lesson_materials where id='custom-library-qa') then raise exception 'Private material leaked';end if;
 if exists(select 1 from public.material_favourites) then raise exception 'Favourites leaked';end if;
 update public.lesson_materials set topic='Foreign edit' where id='custom-library-qa';get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Foreign catalogue update succeeded';end if;
 begin insert into public.material_favourites(material_id) values('custom-library-qa');raise exception 'Foreign private favourite inserted';exception when insufficient_privilege then null;end;
end $$;
delete from public.material_favourites where material_id='a1-01';
select set_config('request.jwt.claims','{"sub":"f81ef0ec-745e-4c38-a407-f78ba485d7b1","role":"authenticated"}',true);
do $$ begin if (select count(*) from public.material_favourites)<>2 then raise exception 'Foreign favourite deletion succeeded';end if;end $$;
delete from public.material_favourites where material_id='a1-01';
do $$ begin if (select count(*) from public.material_favourites)<>1 then raise exception 'Own favourite deletion failed';end if;end $$;
rollback;
select 'PASS: 30 protected lessons, independent catalogue/content revisions, validation, protected counters, private favourites and account isolation; fixtures rolled back' as result;
