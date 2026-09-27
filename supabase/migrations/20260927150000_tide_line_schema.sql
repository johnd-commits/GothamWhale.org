-- Tide Line schema and row level security.
-- Child tables store nickname, avatar, age band, and progress only.
-- Quest completions store a date. They do not store where a child stood.

create schema if not exists extensions;

do $postgis$
begin
  create extension if not exists postgis with schema extensions;
exception
  when duplicate_object then
    null;
end
$postgis$;

set search_path = public, extensions;

create or replace function public.guard_adult_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if new.id is distinct from auth.uid() then
    raise exception 'adults may write only their own row';
  end if;

  if tg_op = 'INSERT' and new.role not in ('parent', 'teacher') then
    raise exception 'self-signup roles are parent or teacher';
  end if;

  if tg_op = 'UPDATE' and new.role is distinct from old.role then
    raise exception 'role changes are not allowed from the client';
  end if;

  return new;
end;
$$;

create or replace function public.guard_sighting_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role text;
begin
  if auth.uid() is null then
    return new;
  end if;

  if tg_op = 'INSERT'
    and (new.decimal_latitude is not null or new.decimal_longitude is not null)
  then
    if not exists (
      select 1
      from public.adults
      where id = new.recorded_by
        and consent_status = 'granted'
    ) then
      raise exception 'precise location requires adult consent';
    end if;
  elsif tg_op = 'UPDATE'
    and (
      new.decimal_latitude is distinct from old.decimal_latitude
      or new.decimal_longitude is distinct from old.decimal_longitude
    )
    and (new.decimal_latitude is not null or new.decimal_longitude is not null)
  then
    if not exists (
      select 1
      from public.adults
      where id = new.recorded_by
        and consent_status = 'granted'
    ) then
      raise exception 'precise location requires adult consent';
    end if;
  end if;

  select role into actor_role
  from public.adults
  where id = auth.uid();

  if tg_op = 'INSERT' then
    if actor_role is null or actor_role not in ('scientist', 'admin') then
      if new.verification_status is distinct from 'received'
        or new.reviewer_id is not null
        or new.review_notes is not null
      then
        raise exception 'only scientists may change verification';
      end if;
    end if;
    return new;
  end if;

  if actor_role in ('scientist', 'admin') then
    if new.occurrence_id is distinct from old.occurrence_id
      or new.basis_of_record is distinct from old.basis_of_record
      or new.event_date is distinct from old.event_date
      or new.scientific_name is distinct from old.scientific_name
      or new.individual_count is distinct from old.individual_count
      or new.decimal_latitude is distinct from old.decimal_latitude
      or new.decimal_longitude is distinct from old.decimal_longitude
      or new.coordinate_uncertainty_in_meters is distinct from old.coordinate_uncertainty_in_meters
      or new.recorded_by is distinct from old.recorded_by
      or new.behavior is distinct from old.behavior
      or new.observer_platform is distinct from old.observer_platform
      or new.media is distinct from old.media
      or new.whale_id is distinct from old.whale_id
    then
      raise exception 'scientists may update verification fields only';
    end if;
  elsif new.verification_status is distinct from old.verification_status
    or new.reviewer_id is distinct from old.reviewer_id
    or new.review_notes is distinct from old.review_notes
  then
    raise exception 'only scientists may change verification';
  end if;

  return new;
end;
$$;

create table public.adults (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('parent', 'teacher', 'scientist', 'admin')),
  consent_status text not null default 'pending' check (consent_status in ('pending', 'granted', 'revoked')),
  consent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  adult_id uuid not null references public.adults (id) on delete cascade,
  nickname text not null check (nickname in (
    'Splash', 'Bubbles', 'Fin', 'Kelp', 'Harbor', 'Tide', 'Pearl', 'Coral',
    'Drift', 'Nimbus', 'Sunny', 'Pebble', 'Mariner', 'Comet', 'Echo'
  )),
  avatar text not null check (avatar in (
    'humpback', 'fluke', 'ferry', 'lighthouse', 'moon', 'shell', 'star', 'kelp'
  )),
  age_band text not null check (age_band in ('7-8', '9-10', '11-12', '13-14')),
  created_at timestamptz not null default now()
);

create table public.whales (
  id uuid primary key default gen_random_uuid(),
  catalog_id text not null unique,
  name text not null,
  sex text check (sex in ('female', 'male', 'unknown')),
  first_seen date,
  notes text,
  hero_image text,
  created_at timestamptz not null default now()
);

create table public.fluke_images (
  id uuid primary key default gen_random_uuid(),
  whale_id uuid not null references public.whales (id) on delete cascade,
  image_url text not null,
  is_training boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.sightings (
  id uuid primary key default gen_random_uuid(),
  occurrence_id text not null unique,
  basis_of_record text not null default 'HumanObservation',
  event_date timestamptz not null,
  scientific_name text not null default 'Megaptera novaeangliae',
  individual_count integer not null default 1 check (individual_count > 0),
  decimal_latitude double precision check (decimal_latitude is null or decimal_latitude between -90 and 90),
  decimal_longitude double precision check (decimal_longitude is null or decimal_longitude between -180 and 180),
  coordinate_uncertainty_in_meters integer check (coordinate_uncertainty_in_meters is null or coordinate_uncertainty_in_meters >= 0),
  recorded_by uuid not null references public.adults (id) on delete restrict,
  behavior text,
  observer_platform text not null check (observer_platform in ('ferry', 'shore', 'boat')),
  media text,
  whale_id uuid references public.whales (id) on delete set null,
  verification_status text not null default 'received' check (verification_status in (
    'received', 'auto_checked', 'expert_reviewed', 'research_grade', 'published', 'rejected'
  )),
  reviewer_id uuid references public.adults (id) on delete set null,
  review_notes text,
  created_at timestamptz not null default now()
);

create table public.follows (
  child_id uuid not null references public.child_profiles (id) on delete cascade,
  whale_id uuid not null references public.whales (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (child_id, whale_id)
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.child_badges (
  child_id uuid not null references public.child_profiles (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  earned_on date not null default current_date,
  primary key (child_id, badge_id)
);

create table public.quests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  instructions text not null,
  quest_type text not null check (quest_type in ('place', 'anywhere')),
  location extensions.geography(Point, 4326),
  radius_meters integer,
  created_at timestamptz not null default now(),
  constraint quests_location_matches_type check (
    (
      quest_type = 'anywhere'
      and location is null
      and radius_meters is null
    )
    or (
      quest_type = 'place'
      and location is not null
      and radius_meters is not null
      and radius_meters > 0
    )
  )
);

create table public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles (id) on delete cascade,
  quest_id uuid not null references public.quests (id) on delete cascade,
  completed_on date not null,
  unique (child_id, quest_id, completed_on)
);

create table public.whale_tales (
  id uuid primary key default gen_random_uuid(),
  whale_id uuid references public.whales (id) on delete set null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.ocean_dex_entries (
  id uuid primary key default gen_random_uuid(),
  adult_id uuid references public.adults (id) on delete cascade,
  child_id uuid references public.child_profiles (id) on delete cascade,
  species_name text,
  whale_id uuid references public.whales (id) on delete cascade,
  collected_on date not null,
  constraint ocean_dex_one_owner check (
    (adult_id is not null and child_id is null)
    or (adult_id is null and child_id is not null)
  ),
  constraint ocean_dex_one_subject check (
    (species_name is not null and whale_id is null)
    or (species_name is null and whale_id is not null)
  )
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.adults (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.class_members (
  class_id uuid not null references public.classes (id) on delete cascade,
  child_id uuid not null references public.child_profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (class_id, child_id)
);

create table public.adoption_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.adoptions (
  id uuid primary key default gen_random_uuid(),
  adult_id uuid not null references public.adults (id) on delete cascade,
  whale_id uuid not null references public.whales (id) on delete restrict,
  tier_id uuid not null references public.adoption_tiers (id) on delete restrict,
  status text not null default 'pledged' check (status in ('pledged', 'active', 'ended')),
  created_at timestamptz not null default now()
);

create or replace function public.is_scientist()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.adults
    where id = auth.uid()
      and role in ('scientist', 'admin')
  );
$$;

create or replace function public.owns_child(target_child uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.child_profiles
    where id = target_child
      and adult_id = auth.uid()
  );
$$;

create or replace function public.teaches_child(target_child uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_members member
    join public.classes course on course.id = member.class_id
    where member.child_id = target_child
      and course.teacher_id = auth.uid()
  );
$$;

create or replace function public.teaches_class(target_class uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.classes
    where id = target_class
      and teacher_id = auth.uid()
  );
$$;

create index child_profiles_adult_id_idx on public.child_profiles (adult_id);
create index sightings_recorded_by_idx on public.sightings (recorded_by);
create index sightings_verification_status_idx on public.sightings (verification_status);
create index fluke_images_whale_id_idx on public.fluke_images (whale_id);
create index classes_teacher_id_idx on public.classes (teacher_id);
create index class_members_child_id_idx on public.class_members (child_id);
create index quest_completions_child_id_idx on public.quest_completions (child_id);

create trigger adults_guard_write
  before insert or update on public.adults
  for each row execute function public.guard_adult_write();

create trigger sightings_guard_write
  before insert or update on public.sightings
  for each row execute function public.guard_sighting_write();

alter table public.adults enable row level security;
alter table public.adults force row level security;
alter table public.child_profiles enable row level security;
alter table public.child_profiles force row level security;
alter table public.whales enable row level security;
alter table public.whales force row level security;
alter table public.fluke_images enable row level security;
alter table public.fluke_images force row level security;
alter table public.sightings enable row level security;
alter table public.sightings force row level security;
alter table public.follows enable row level security;
alter table public.follows force row level security;
alter table public.badges enable row level security;
alter table public.badges force row level security;
alter table public.child_badges enable row level security;
alter table public.child_badges force row level security;
alter table public.quests enable row level security;
alter table public.quests force row level security;
alter table public.quest_completions enable row level security;
alter table public.quest_completions force row level security;
alter table public.whale_tales enable row level security;
alter table public.whale_tales force row level security;
alter table public.ocean_dex_entries enable row level security;
alter table public.ocean_dex_entries force row level security;
alter table public.classes enable row level security;
alter table public.classes force row level security;
alter table public.class_members enable row level security;
alter table public.class_members force row level security;
alter table public.adoption_tiers enable row level security;
alter table public.adoption_tiers force row level security;
alter table public.adoptions enable row level security;
alter table public.adoptions force row level security;

create policy adults_select_self on public.adults
  for select to authenticated
  using (id = auth.uid());

create policy adults_insert_self on public.adults
  for insert to authenticated
  with check (id = auth.uid() and role in ('parent', 'teacher'));

create policy adults_update_self on public.adults
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy adults_delete_self on public.adults
  for delete to authenticated
  using (id = auth.uid());

create policy child_profiles_select on public.child_profiles
  for select to authenticated
  using (adult_id = auth.uid() or public.teaches_child(id));

create policy child_profiles_insert on public.child_profiles
  for insert to authenticated
  with check (adult_id = auth.uid());

create policy child_profiles_update on public.child_profiles
  for update to authenticated
  using (adult_id = auth.uid())
  with check (adult_id = auth.uid());

create policy child_profiles_delete on public.child_profiles
  for delete to authenticated
  using (adult_id = auth.uid());

create policy whales_public_read on public.whales
  for select to anon, authenticated
  using (true);

create policy fluke_training_read on public.fluke_images
  for select to anon, authenticated
  using (is_training = true);

create policy sightings_select on public.sightings
  for select to authenticated
  using (recorded_by = auth.uid() or public.is_scientist());

create policy sightings_insert on public.sightings
  for insert to authenticated
  with check (recorded_by = auth.uid());

create policy sightings_update on public.sightings
  for update to authenticated
  using (recorded_by = auth.uid() or public.is_scientist())
  with check (recorded_by = auth.uid() or public.is_scientist());

create policy sightings_delete on public.sightings
  for delete to authenticated
  using (recorded_by = auth.uid());

create policy follows_owner on public.follows
  for all to authenticated
  using (public.owns_child(child_id))
  with check (public.owns_child(child_id));

create policy badges_public_read on public.badges
  for select to anon, authenticated
  using (true);

create policy child_badges_owner on public.child_badges
  for all to authenticated
  using (public.owns_child(child_id))
  with check (public.owns_child(child_id));

create policy quests_public_read on public.quests
  for select to anon, authenticated
  using (true);

create policy quest_completions_owner on public.quest_completions
  for all to authenticated
  using (public.owns_child(child_id))
  with check (public.owns_child(child_id));

create policy whale_tales_public_read on public.whale_tales
  for select to anon, authenticated
  using (true);

create policy ocean_dex_select on public.ocean_dex_entries
  for select to authenticated
  using (
    adult_id = auth.uid()
    or public.owns_child(child_id)
  );

create policy ocean_dex_insert on public.ocean_dex_entries
  for insert to authenticated
  with check (
    (adult_id = auth.uid() and child_id is null)
    or (adult_id is null and public.owns_child(child_id))
  );

create policy ocean_dex_update on public.ocean_dex_entries
  for update to authenticated
  using (adult_id = auth.uid() or public.owns_child(child_id))
  with check (
    (adult_id = auth.uid() and child_id is null)
    or (adult_id is null and public.owns_child(child_id))
  );

create policy ocean_dex_delete on public.ocean_dex_entries
  for delete to authenticated
  using (adult_id = auth.uid() or public.owns_child(child_id));

create policy classes_teacher on public.classes
  for all to authenticated
  using (teacher_id = auth.uid())
  with check (teacher_id = auth.uid());

create policy class_members_select on public.class_members
  for select to authenticated
  using (public.teaches_class(class_id) or public.owns_child(child_id));

create policy class_members_insert on public.class_members
  for insert to authenticated
  with check (public.owns_child(child_id));

create policy class_members_delete on public.class_members
  for delete to authenticated
  using (public.owns_child(child_id) or public.teaches_class(class_id));

create policy adoption_tiers_public_read on public.adoption_tiers
  for select to anon, authenticated
  using (true);

create policy adoptions_owner on public.adoptions
  for all to authenticated
  using (adult_id = auth.uid())
  with check (adult_id = auth.uid());

-- Public map rows only. Coordinates are rounded to 2 decimals.
-- The view owner applies the filter. Callers cannot read the base table through this view.
create view public.public_sightings
with (security_invoker = false) as
select
  id,
  occurrence_id as "occurrenceID",
  basis_of_record as "basisOfRecord",
  event_date as "eventDate",
  scientific_name as "scientificName",
  individual_count as "individualCount",
  round(decimal_latitude::numeric, 2) as "decimalLatitude",
  round(decimal_longitude::numeric, 2) as "decimalLongitude",
  coordinate_uncertainty_in_meters as "coordinateUncertaintyInMeters",
  observer_platform,
  whale_id,
  verification_status
from public.sightings
where verification_status in ('research_grade', 'published');

revoke all on table public.adults from anon, authenticated;
revoke all on table public.child_profiles from anon, authenticated;
revoke all on table public.whales from anon, authenticated;
revoke all on table public.fluke_images from anon, authenticated;
revoke all on table public.sightings from anon, authenticated;
revoke all on table public.follows from anon, authenticated;
revoke all on table public.badges from anon, authenticated;
revoke all on table public.child_badges from anon, authenticated;
revoke all on table public.quests from anon, authenticated;
revoke all on table public.quest_completions from anon, authenticated;
revoke all on table public.whale_tales from anon, authenticated;
revoke all on table public.ocean_dex_entries from anon, authenticated;
revoke all on table public.classes from anon, authenticated;
revoke all on table public.class_members from anon, authenticated;
revoke all on table public.adoption_tiers from anon, authenticated;
revoke all on table public.adoptions from anon, authenticated;
revoke all on table public.public_sightings from anon, authenticated;

grant select, insert, update, delete on table public.adults to authenticated;
grant select, insert, update, delete on table public.child_profiles to authenticated;
grant select on table public.whales to anon, authenticated;
grant select on table public.fluke_images to anon, authenticated;
grant select, insert, update, delete on table public.sightings to authenticated;
grant select, insert, update, delete on table public.follows to authenticated;
grant select on table public.badges to anon, authenticated;
grant select, insert, update, delete on table public.child_badges to authenticated;
grant select on table public.quests to anon, authenticated;
grant select, insert, update, delete on table public.quest_completions to authenticated;
grant select on table public.whale_tales to anon, authenticated;
grant select, insert, update, delete on table public.ocean_dex_entries to authenticated;
grant select, insert, update, delete on table public.classes to authenticated;
grant select, insert, delete on table public.class_members to authenticated;
grant select on table public.adoption_tiers to anon, authenticated;
grant select, insert, update, delete on table public.adoptions to authenticated;
grant select on table public.public_sightings to anon, authenticated;

revoke all on function public.guard_adult_write() from public, anon, authenticated;
revoke all on function public.guard_sighting_write() from public, anon, authenticated;
revoke all on function public.is_scientist() from public, anon;
revoke all on function public.owns_child(uuid) from public, anon;
revoke all on function public.teaches_child(uuid) from public, anon;
revoke all on function public.teaches_class(uuid) from public, anon;

grant execute on function public.is_scientist() to authenticated;
grant execute on function public.owns_child(uuid) to authenticated;
grant execute on function public.teaches_child(uuid) to authenticated;
grant execute on function public.teaches_class(uuid) to authenticated;

comment on table public.child_profiles is
  'Picker nickname, avatar, and age band only. No name, email, photo, or location.';
comment on table public.quest_completions is
  'Stores child_id, quest_id, and completed_on. Never a child location.';
comment on view public.public_sightings is
  'Research-grade and published sightings with coordinates rounded to 2 decimals.';
