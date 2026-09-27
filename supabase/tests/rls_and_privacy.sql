begin;

create extension if not exists pgtap with schema extensions;

select plan(15);

select is(
  (
    select count(*)::int
    from information_schema.columns
    where table_schema = 'public'
      and table_name = any (array[
        'child_profiles',
        'follows',
        'child_badges',
        'quest_completions',
        'ocean_dex_entries'
      ])
      and column_name ~* '(latitude|longitude|location|geog|geom)'
  ),
  0,
  'children tables have no location columns'
);

select results_eq(
  $$
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'quest_completions'
    order by column_name
  $$,
  $$ values ('child_id'), ('completed_on'), ('id'), ('quest_id') $$,
  'quest completions store a date and no place'
);

select ok(
  (
    select c.relrowsecurity and c.relforcerowsecurity
    from pg_class as c
    where c.oid = 'public.child_profiles'::regclass
  ),
  'child profiles force row level security'
);

select ok(
  (
    select c.relrowsecurity and c.relforcerowsecurity
    from pg_class as c
    where c.oid = 'public.sightings'::regclass
  ),
  'sightings force row level security'
);

create temp table vars (
  adult_a uuid,
  adult_b uuid,
  child_a uuid,
  child_b uuid,
  scientist uuid,
  teacher uuid
);

insert into vars
values (
  gen_random_uuid(),
  gen_random_uuid(),
  gen_random_uuid(),
  gen_random_uuid(),
  gen_random_uuid(),
  gen_random_uuid()
);

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
select
  '00000000-0000-0000-0000-000000000000',
  person.id,
  'authenticated',
  'authenticated',
  person.email,
  '',
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
from (
  select adult_a as id, 'adult-a@example.com' as email from vars
  union all
  select adult_b, 'adult-b@example.com' from vars
  union all
  select scientist, 'scientist@example.com' from vars
  union all
  select teacher, 'teacher@example.com' from vars
) as person;

insert into public.adults (id, role, consent_status, consent_at)
select adult_a, 'parent', 'granted', now() from vars
union all
select adult_b, 'parent', 'granted', now() from vars
union all
select scientist, 'scientist', 'granted', now() from vars
union all
select teacher, 'teacher', 'pending', null from vars;

insert into public.child_profiles (id, adult_id, nickname, avatar, age_band)
select child_a, adult_a, 'Splash', 'humpback', '7-8' from vars
union all
select child_b, adult_b, 'Kelp', 'fluke', '9-10' from vars;

select set_config('request.jwt.claim.sub', (select adult_a::text from vars), true);
select set_config(
  'request.jwt.claims',
  json_build_object('sub', (select adult_a from vars), 'role', 'authenticated')::text,
  true
);
set local role authenticated;

select is(
  (select count(*)::int from public.child_profiles),
  1,
  'a parent sees only their own child'
);

select is_empty(
  format(
    'select id from public.child_profiles where id = %L',
    (select child_b from vars)
  ),
  'a parent cannot read another family'
);

insert into public.sightings (
  occurrence_id,
  event_date,
  recorded_by,
  observer_platform,
  decimal_latitude,
  decimal_longitude
)
select
  'test-occurrence',
  now(),
  adult_a,
  'shore',
  40.712,
  -74.006
from vars;

select throws_ok(
  $$
    update public.sightings
    set verification_status = 'research_grade'
    where occurrence_id = 'test-occurrence'
  $$,
  'P0001',
  'only scientists may change verification',
  'a parent cannot change verification'
);

reset role;
select set_config('request.jwt.claim.sub', (select scientist::text from vars), true);
select set_config(
  'request.jwt.claims',
  json_build_object('sub', (select scientist from vars), 'role', 'authenticated')::text,
  true
);
set local role authenticated;

update public.sightings
set
  verification_status = 'research_grade',
  reviewer_id = (select scientist from vars)
where occurrence_id = 'test-occurrence';

select is(
  (
    select verification_status
    from public.sightings
    where occurrence_id = 'test-occurrence'
  ),
  'research_grade',
  'a scientist can mark a sighting research grade'
);

select throws_ok(
  $$
    update public.sightings
    set behavior = 'breach'
    where occurrence_id = 'test-occurrence'
  $$,
  'P0001',
  'scientists may update verification fields only',
  'a scientist cannot edit the sighting story'
);

reset role;
select set_config('request.jwt.claim.sub', (select teacher::text from vars), true);
select set_config(
  'request.jwt.claims',
  json_build_object('sub', (select teacher from vars), 'role', 'authenticated')::text,
  true
);
set local role authenticated;

select is_empty(
  'select id from public.child_profiles',
  'a teacher cannot read children outside their class'
);

reset role;

insert into public.classes (id, teacher_id, name)
select '22222222-2222-4222-8222-222222222222', teacher, 'Harbor class'
from vars;

insert into public.class_members (class_id, child_id)
select '22222222-2222-4222-8222-222222222222', child_a
from vars;

select set_config('request.jwt.claim.sub', (select teacher::text from vars), true);
select set_config(
  'request.jwt.claims',
  json_build_object('sub', (select teacher from vars), 'role', 'authenticated')::text,
  true
);
set local role authenticated;

select is(
  (select nickname from public.child_profiles where id = (select child_a from vars)),
  'Splash',
  'a teacher can read a child in their class'
);

reset role;

insert into public.whales (catalog_id, name)
values ('RLS-SAMPLE', 'RLS Sample');

insert into public.sightings (
  occurrence_id,
  event_date,
  recorded_by,
  observer_platform,
  decimal_latitude,
  decimal_longitude,
  verification_status
)
select
  'test-received',
  now(),
  adult_a,
  'ferry',
  41.111,
  -73.111,
  'received'
from vars;

select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '', true);
set local role anon;

select is_empty(
  'select id from public.child_profiles',
  'anon cannot read children'
);

select is(
  (select count(*)::int from public.public_sightings),
  1,
  'the public view hides sightings that are not research grade'
);

select is(
  (select "decimalLatitude" from public.public_sightings),
  40.71,
  'the public view rounds latitude to 2 decimals'
);

select is(
  (select name from public.whales where catalog_id = 'RLS-SAMPLE'),
  'RLS Sample',
  'anon can read the whale catalog'
);

select * from finish();

rollback;
