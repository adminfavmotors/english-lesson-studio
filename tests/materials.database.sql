begin;
insert into auth.users(id,aud,role,email) values
('f81ef0ec-745e-4c38-a407-f78ba485d7b1','authenticated','authenticated','material-test-a@example.invalid'),
('f81ef0ec-745e-4c38-a407-f78ba485d7b2','authenticated','authenticated','material-test-b@example.invalid');
set local role anon;
do $$ begin if (select count(*) from public.lesson_materials where level='A1')<>30 then raise exception 'Public A1 collection is incomplete';end if;end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f81ef0ec-745e-4c38-a407-f78ba485d7b1","role":"authenticated"}',true);
insert into public.lesson_materials(id,content) select 'custom-library-qa',jsonb_set(content,'{title}','"Private QA lesson"') from public.lesson_materials where id='a1-01';
insert into public.material_favourites(material_id) values('a1-01'),('custom-library-qa');
do $$ declare affected integer; begin
 if (select count(*) from public.material_favourites)<>2 then raise exception 'Favourite write failed';end if;
 update public.lesson_materials set content=jsonb_set(content,'{title}','"Tampered"') where id='a1-01';get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Shared material modified by teacher';end if;
 begin update public.lesson_materials set owner_id=null where id='custom-library-qa';raise exception 'Owner changed';exception when insufficient_privilege then null;end;
 begin insert into public.lesson_materials(id,content) select 'custom-bad-qa',jsonb_set(content,'{level}','null'::jsonb) from public.lesson_materials where id='a1-01';raise exception 'Null metadata allowed';exception when not_null_violation then null;end;
end $$;
update public.lesson_materials set content=jsonb_set(content,'{subtitle}','"Updated"') where id='custom-library-qa' and version=1;
do $$ begin if (select version from public.lesson_materials where id='custom-library-qa')<>2 then raise exception 'Version failed';end if;end $$;
select set_config('request.jwt.claims','{"sub":"f81ef0ec-745e-4c38-a407-f78ba485d7b2","role":"authenticated"}',true);
do $$ begin
 if exists(select 1 from public.lesson_materials where id='custom-library-qa') then raise exception 'Private material leaked';end if;
 if exists(select 1 from public.material_favourites) then raise exception 'Favourites leaked';end if;
 begin insert into public.material_favourites(material_id) values('custom-library-qa');raise exception 'Foreign private favourite inserted';exception when insufficient_privilege then null;end;
end $$;
delete from public.material_favourites where material_id='a1-01';
select set_config('request.jwt.claims','{"sub":"f81ef0ec-745e-4c38-a407-f78ba485d7b1","role":"authenticated"}',true);
do $$ begin if (select count(*) from public.material_favourites)<>2 then raise exception 'Foreign favourite deletion succeeded';end if;end $$;
delete from public.material_favourites where material_id='a1-01';
do $$ begin if (select count(*) from public.material_favourites)<>1 then raise exception 'Own favourite deletion failed';end if;end $$;
rollback;
select 'PASS: 30 public lessons, protected shared content, private import and revision, private favourites and account isolation; fixtures rolled back' as result;
