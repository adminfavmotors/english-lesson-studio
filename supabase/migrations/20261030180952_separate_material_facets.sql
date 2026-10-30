-- Apply the editorial review only to its exact studio revisions.
-- Private and unrecognised materials retain their previous tags for review.
alter table public.lesson_materials
  drop constraint lesson_materials_skills_check,
  alter column skills drop not null,
  add column language_focus jsonb,
  add column classification_status text not null default 'needs_review',
  add column legacy_skills jsonb;

create or replace function public.material_revision() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.version := old.version + (new.content is distinct from old.content)::integer;
  new.catalogue_version := old.catalogue_version + (
    row(new.title,new.subtitle,new.level,new.topic,new.skills,new.duration,new.sequence,
        new.language_focus,new.classification_status,new.legacy_skills)
    is distinct from
    row(old.title,old.subtitle,old.level,old.topic,old.skills,old.duration,old.sequence,
        old.language_focus,old.classification_status,old.legacy_skills)
  )::integer;
  -- Generated search_text is not populated in NEW before this trigger runs.
  -- Compare stored changes, rather than treating that temporary null as an edit.
  if new.version <> old.version or new.catalogue_version <> old.catalogue_version or
     row(new.id,new.owner_id,new.created_at) is distinct from row(old.id,old.owner_id,old.created_at)
  then new.updated_at := now();
  else new.updated_at := old.updated_at;
  end if;
  return new;
end;
$$;
revoke all on function public.material_revision() from public,anon,authenticated;

-- Digests use PostgreSQL's jsonb::text representation, computed from the
-- source objects whose portable hashes were verified against review version 1.
do $migration$
declare
  reviewed record;
  current_material public.lesson_materials%rowtype;
begin
  for reviewed in select * from jsonb_to_recordset(
    $classification_review$[
  {
    "id": "a1-01",
    "version": 4,
    "content_hash": "8221e803708ef9666f24fe676c229a365deff9dbad8eb4a81f7bba6e6a5f7d39",
    "catalogue_hash": "fcd127147ff7a2796d2e04fbbf45cad577712fbcdb5d480da99fbeb5046b87b2",
    "skills": [
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-02",
    "version": 2,
    "content_hash": "e3eabf6363d3fecb747682c27f72a1177619c1fffc93f427f981e157df259ed0",
    "catalogue_hash": "1656e8ce31034a0516e0827a5067c80a2e99ac8109f1006d606885df796d6ddc",
    "skills": [
      "listening",
      "speaking"
    ],
    "language_focus": [
      "vocabulary",
      "pronunciation",
      "spelling_punctuation"
    ]
  },
  {
    "id": "a1-03",
    "version": 2,
    "content_hash": "ee19278ef5fda1c078a62b67c6def0d19efbb6a1e241a8829dfb4e038c23a7ac",
    "catalogue_hash": "36852f6bfa98210213726ebe3a7ee26c39fe3f26cabea3ac7bcf68c402502cbc",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-04",
    "version": 3,
    "content_hash": "3d6bd2f37633458bba931e97d146eff513450618171b1591a09996221fa9009a",
    "catalogue_hash": "0b96dcb18ea0b9daa9a8c7d0c9bc07e727d264656f61d4f260574315d21d5daf",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary",
      "spelling_punctuation"
    ]
  },
  {
    "id": "a1-05",
    "version": 3,
    "content_hash": "7a7ae9df6915a7ced4fd63144747aacd43f955267dfc4227cdd116834a493809",
    "catalogue_hash": "f620db0b8d6ad4ceb03faa844f1e556946bbf7de8c9008f83c16cc1937058e79",
    "skills": [
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-06",
    "version": 2,
    "content_hash": "fe045396d594456fc47fc7980187606a69d82bca93ed9b74db4dd9b2433ce8cf",
    "catalogue_hash": "ca244944eda22cf95cccdc1c25b3904793887683b4f2b2438a0d9e8f3afe2436",
    "skills": [
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-07",
    "version": 3,
    "content_hash": "e14672b82ba55ce73ee118a7e5e6382de10235ac8ff022d88fc17c291680dda8",
    "catalogue_hash": "66ad0529f1433e9664d4a9527e80540bc9535de1a765b50a58c5644215ffe69a",
    "skills": [
      "reading",
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary",
      "spelling_punctuation"
    ]
  },
  {
    "id": "a1-08",
    "version": 3,
    "content_hash": "9849316cea2a64d4da05aca9b40f7fae1e2eee0c291b577059c79c8c3daf5e35",
    "catalogue_hash": "0b7fce80a8b389b1c6a69b5afddf74e458e0e59d4e027fd6ea913607301a155d",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-09",
    "version": 2,
    "content_hash": "a43a090799454dc3aafe965a368dab4b228b4aea195656d410644e78f0ef9882",
    "catalogue_hash": "1d64952bf875cc883f5f4465ee136e2d54925fb7ce976ca8e419795d52b70f16",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-10",
    "version": 3,
    "content_hash": "dcc2fe75bd159502b04f309432597cc5870861e54948ebfe22241b838c894449",
    "catalogue_hash": "6667291fe499299000ca40a175dd0b3b615bfbb7a0f52fcf0729976a6c86483b",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-11",
    "version": 3,
    "content_hash": "6f077192244f760d706650268c2cb3ede01446dc1f2f5b472815395f5c2712d5",
    "catalogue_hash": "8f5211c2c91a84e664d19df304680c55837c0e3d42af8c6f852573dac1309dd2",
    "skills": [
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar"
    ]
  },
  {
    "id": "a1-12",
    "version": 2,
    "content_hash": "e545d725f99df0d53ea8c4cbde74c130ccb0d9e0598e023ee6b84648998df649",
    "catalogue_hash": "ba84559e98c6a26bc2bfc8bad924242ad33c80a60ae7716e71fb59975b4d7157",
    "skills": [
      "listening",
      "speaking"
    ],
    "language_focus": [
      "grammar"
    ]
  },
  {
    "id": "a1-13",
    "version": 3,
    "content_hash": "14baab3ad3af3952c41b455931c342beec8e206d265e302c5f914932f93573d1",
    "catalogue_hash": "e7ae895e8777131fb15cb8b11e0860c725f1c5a4c34e107426b6794b7cec3551",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-14",
    "version": 2,
    "content_hash": "c7bd189fc9c9744bfd701c6cc031405e0c35423fb02a2bd327b72cbe8eba13a2",
    "catalogue_hash": "3db0f31bd46fc1453c0c5f5ff12965028b223ce1c09c60bde2508df90e7bfd36",
    "skills": [
      "reading",
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "vocabulary"
    ]
  },
  {
    "id": "a1-15",
    "version": 3,
    "content_hash": "36f9daad291836e8115c3b44395ccf4228dc97df22cc108ed60691cd18465015",
    "catalogue_hash": "07b3982195453959ef3b2f5a414c39ff929cf1afebc3acff398bfb88dfdd7cf0",
    "skills": [
      "listening",
      "speaking"
    ],
    "language_focus": [
      "grammar",
      "vocabulary",
      "pronunciation",
      "spelling_punctuation"
    ]
  },
  {
    "id": "a1-16",
    "version": 3,
    "content_hash": "418e671da3be5e81315e7619cb97b6b4e25573e6fa9a94a04556cad125530391",
    "catalogue_hash": "f2e8f63c3c53e3f397e5dfe5b8b2f9b475094ff3af943532a294bbf81c6a7516",
    "skills": [
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-17",
    "version": 3,
    "content_hash": "fea5482021f9f52b4417bfd6c8a5003c0a969722c449e49615474d8748788385",
    "catalogue_hash": "1083c0bdc11d558597a5c24d4934f07e507718c21b2ccf3fb164e7b19ffb09d0",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-18",
    "version": 2,
    "content_hash": "5f57e2d3d5b873f6d03ccb9f2e24c0a7343000c191e93fa9d97544be0aed4ab4",
    "catalogue_hash": "d2853180b220a0cef59591f30ffd7f56bee54bdafabf35f8872d6a2c7b6b4307",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-19",
    "version": 3,
    "content_hash": "43f9dc5ec4867f5b55891334a0fa34d6010320e52840707e60963b649f55f67a",
    "catalogue_hash": "48889c52d2bc4fe1c88b64140fbc68493d4772bb4f11e1e11de35ea1f7a4d7a6",
    "skills": [
      "reading",
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-20",
    "version": 3,
    "content_hash": "ae0d904fefa2b354ec0537cf85e97d32bc2d6b50f9e7413b102449f5012edc61",
    "catalogue_hash": "74c653888ad60f5bc13dd3977d04af64e952854cfe396d657e3c105912a75102",
    "skills": [
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-21",
    "version": 2,
    "content_hash": "d27a053845996c3aeeb8cfbefb0bbe398126b7888ac610f8085d5894f2d4d472",
    "catalogue_hash": "ef4d9bac3c6095a7396c12337d09f5086d73ba5050b8f4a1a8e5f94aefddfb95",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-22",
    "version": 3,
    "content_hash": "38fa2c66aa11adc723998d253e892fe52c6e9b1331143357592b1280870e80cb",
    "catalogue_hash": "00e9b79acd8b0851764de1d60a992f349ec61a1e7e18a56d39e5d9edf4bfe64d",
    "skills": [
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-23",
    "version": 2,
    "content_hash": "a6443efec261cd5e52a3a6e7571dd349b32a999231709a26d74d75b3b7e88a80",
    "catalogue_hash": "6ee97f0214785055f89ac4ee0e1fe728df78751a50be0ecf34076f364206b083",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-24",
    "version": 3,
    "content_hash": "3ea94c38646ece39622aa83b72ee5845e7b890f0d93586056140343376b16c6a",
    "catalogue_hash": "ad73efca88a007393197f84f5334e5d6d132d89c5baacfdd7d13c85c27b44bbd",
    "skills": [
      "reading",
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "vocabulary"
    ]
  },
  {
    "id": "a1-25",
    "version": 3,
    "content_hash": "e5d439d00317099a2eeadbbc02ee46f0a144489e8c30994cf279b590114591f9",
    "catalogue_hash": "66a39c08e594926935d78e2b22f8def2ba3e06ca13b455d3a44105531f93a1bf",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-26",
    "version": 2,
    "content_hash": "8acca894e2159b7642b5f040add677a1f3bc6002438532b6d995df1d9a4a242f",
    "catalogue_hash": "2889ce3e441904e4e359a029f1b0d1df6a61953e3f349d80a2fffb12cf5b506f",
    "skills": [
      "reading",
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  },
  {
    "id": "a1-27",
    "version": 2,
    "content_hash": "f4d8b5e67e9a8c150e856dab812b50b492651a7b3e3ffcbbb7d770885d84efb7",
    "catalogue_hash": "c3053d50ddf64cececbf9ef3c9460d31345c00921a6f603a23bca201905f5e3a",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "vocabulary",
      "spelling_punctuation"
    ]
  },
  {
    "id": "a1-28",
    "version": 2,
    "content_hash": "c3f3a675d78bc3b01fdb21edf3925dc86058f60ab39f59350c8282de324cf78b",
    "catalogue_hash": "b5f3332fd0bd6520e7b3fdc944858195fe7284b72f7814a1f28ac35351fba6fb",
    "skills": [
      "listening",
      "speaking"
    ],
    "language_focus": [
      "vocabulary"
    ]
  },
  {
    "id": "a1-29",
    "version": 3,
    "content_hash": "30682a8fb324e4f2616db57c383654ad08f270ca86eaa689bbdde6bf559c9970",
    "catalogue_hash": "cddf83e0e50cb2e5e9e8bdc6dbce8d5c2bef65b89b1e99b8f069bf9b2a87d11b",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "vocabulary"
    ]
  },
  {
    "id": "a1-30",
    "version": 4,
    "content_hash": "9a7e97a56ccf593048bc1382a7eea5d04ae84d1c7b23fadd5900e3ae2e31cc1e",
    "catalogue_hash": "4b727067c82984363470fc0fe0db976a30cb43886ec4ad788e08c8205d57c1fb",
    "skills": [
      "listening",
      "speaking",
      "writing"
    ],
    "language_focus": [
      "grammar",
      "vocabulary"
    ]
  }
]$classification_review$::jsonb
  ) as r(id text,version integer,content_hash text,catalogue_hash text,skills jsonb,language_focus jsonb)
  loop
    select * into current_material from public.lesson_materials
      where id=reviewed.id and owner_id is null;
    if not found then continue; end if;
    if current_material.version <> reviewed.version or
       encode(sha256(convert_to(current_material.content::text,'UTF8')),'hex') <> reviewed.content_hash or
       encode(sha256(convert_to(jsonb_build_object(
         'title',current_material.title,'subtitle',current_material.subtitle,
         'level',current_material.level,'topic',current_material.topic,
         'skills',current_material.skills,'duration',current_material.duration,
         'sequence',current_material.sequence)::text,'UTF8')),'hex') <> reviewed.catalogue_hash then
      raise exception 'Material % differs from its classification review; reconcile it before migration.',reviewed.id;
    end if;
    update public.lesson_materials set skills=reviewed.skills,
      language_focus=reviewed.language_focus,classification_status='reviewed',legacy_skills=null
      where id=reviewed.id and owner_id is null;
  end loop;
end;
$migration$;

update public.lesson_materials set legacy_skills=skills,skills=null
  where classification_status='needs_review';

alter table public.lesson_materials
  add constraint material_classification check (
    case when classification_status='reviewed' and
      jsonb_typeof(skills)='array' and jsonb_typeof(language_focus)='array' and legacy_skills is null
    then
      skills <@ '["reading","listening","speaking","writing"]'::jsonb and
      jsonb_array_length(skills) =
        (skills ? 'reading')::integer + (skills ? 'listening')::integer +
        (skills ? 'speaking')::integer + (skills ? 'writing')::integer and
      language_focus <@ '["grammar","vocabulary","pronunciation","spelling_punctuation"]'::jsonb and
      jsonb_array_length(language_focus) =
        (language_focus ? 'grammar')::integer + (language_focus ? 'vocabulary')::integer +
        (language_focus ? 'pronunciation')::integer + (language_focus ? 'spelling_punctuation')::integer and
      jsonb_array_length(skills) + jsonb_array_length(language_focus) > 0
    when classification_status='needs_review' and skills is null and language_focus is null and
      jsonb_typeof(legacy_skills)='array'
    then jsonb_array_length(legacy_skills) between 1 and 8 and
      legacy_skills <@ '["reading","listening","speaking","writing","grammar","vocabulary","spelling","pronunciation"]'::jsonb
    else false end
  ),
  drop constraint material_content_schema,
  add constraint material_content_schema check (
    jsonb_typeof(content)='object' and content->'schemaVersion'='2'::jsonb and
    octet_length(content::text)<=150000 and
    content ?& array['schemaVersion','goal','vocabulary','language','input','retrieval','practice','speaking','writing','exit','homework','teacherNotes'] and
    not content ?| array['title','subtitle','level','topic','skills','duration','sequence','language_focus','classification_status','legacy_skills']
  );

create index lesson_materials_language_focus on public.lesson_materials using gin(language_focus);
grant insert(language_focus,classification_status,legacy_skills) on public.lesson_materials to authenticated;
grant update(language_focus,classification_status,legacy_skills) on public.lesson_materials to authenticated;
comment on column public.lesson_materials.skills is 'Reviewed communicative skills; null when classification needs review.';
comment on column public.lesson_materials.language_focus is 'Reviewed language features; independent of communicative skills.';
comment on column public.lesson_materials.legacy_skills is 'Unreviewed previous mixed tags retained without automatic reinterpretation.';
comment on column public.lesson_materials.classification_status is 'Editorial classification state, not account access or publication approval.';
