-- Sample catalog for a local reset. supabase db push does not run this file.
-- These are not real whales. Placeholder image names do not contact another service.

set search_path = public, extensions;

insert into public.whales (id, catalog_id, name, sex, first_seen, notes, hero_image)
values
  ('11111111-1111-4111-8111-111111111001', 'SAMPLE-001', 'Sample Humpback 1', 'female', '2018-06-01', 'Sample catalog row for local setup. Not a real whale.', 'placeholder://whales/sample-001.png'),
  ('11111111-1111-4111-8111-111111111002', 'SAMPLE-002', 'Sample Humpback 2', 'male', '2019-07-12', 'Sample catalog row for local setup. Not a real whale.', 'placeholder://whales/sample-002.png'),
  ('11111111-1111-4111-8111-111111111003', 'SAMPLE-003', 'Sample Humpback 3', 'unknown', '2020-08-03', 'Sample catalog row for local setup. Not a real whale.', 'placeholder://whales/sample-003.png'),
  ('11111111-1111-4111-8111-111111111004', 'SAMPLE-004', 'Sample Humpback 4', 'unknown', '2021-05-19', 'Sample catalog row for local setup. Not a real whale.', 'placeholder://whales/sample-004.png'),
  ('11111111-1111-4111-8111-111111111005', 'SAMPLE-005', 'Sample Humpback 5', 'female', '2022-09-30', 'Sample catalog row for local setup. Not a real whale.', 'placeholder://whales/sample-005.png');

insert into public.fluke_images (whale_id, image_url, is_training)
select
  whale.id,
  'placeholder://flukes/sample-' || lpad(image_number.num::text, 2, '0') || '.png',
  true
from generate_series(1, 20) as image_number(num)
join public.whales as whale
  on whale.catalog_id = 'SAMPLE-' || lpad((((image_number.num - 1) / 4) + 1)::text, 3, '0');

insert into public.whale_tales (whale_id, title, body)
values
  (
    '11111111-1111-4111-8111-111111111001',
    'A tail like a fingerprint',
    'Each humpback tail is different. Stay at least 100 yards away, and go to the water with a grown-up.'
  ),
  (
    '11111111-1111-4111-8111-111111111002',
    'The harbor visitors',
    'Some whales visit New York in summer. Watch from the ferry or the shore with a grown-up.'
  ),
  (
    '11111111-1111-4111-8111-111111111003',
    'Quiet looking',
    'A calm look is enough. Do not chase a whale. Keep at least 100 yards of space.'
  );

insert into public.quests (title, instructions, quest_type, location, radius_meters)
values
  (
    'Harbor path',
    'Walk a harbor path with a grown-up. Stay at least 100 yards from whales.',
    'place',
    extensions.st_setsrid(extensions.st_makepoint(-74.02, 40.70), 4326)::extensions.geography,
    400
  ),
  (
    'Bridge park',
    'Visit a park by the water with a grown-up. Keep your distance from any whale.',
    'place',
    extensions.st_setsrid(extensions.st_makepoint(-73.99, 40.70), 4326)::extensions.geography,
    400
  ),
  (
    'Draw a fluke',
    'Draw a whale tail on paper. You can do this at home.',
    'anywhere',
    null,
    null
  ),
  (
    'Read a tale',
    'Read one whale tale. Notice how its tail looks.',
    'anywhere',
    null,
    null
  ),
  (
    'Ocean minute',
    'Sit still for one quiet minute and think about the sea.',
    'anywhere',
    null,
    null
  );

insert into public.badges (slug, name, description)
values
  ('first-follow', 'First Follow', 'You picked a whale to follow.'),
  ('fluke-finder', 'Fluke Finder', 'You matched a whale tail in practice.'),
  ('calm-minute', 'Calm Minute', 'You finished a quiet ocean minute.'),
  ('tale-reader', 'Tale Reader', 'You read a whale tale.'),
  ('quest-starter', 'Quest Starter', 'You finished your first quest.'),
  ('dex-collector', 'Dex Collector', 'You saved your first ocean dex card.'),
  ('gentle-watcher', 'Gentle Watcher', 'You remembered to stay at least 100 yards from whales.'),
  ('grown-up-trip', 'Grown-up Trip', 'You went outside with a grown-up.'),
  ('five-follows', 'Five Follows', 'You follow five whales.'),
  ('harbor-helper', 'Harbor Helper', 'You finished a harbor quest with a grown-up.');
