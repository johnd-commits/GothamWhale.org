/**
 * @jest-environment node
 */
declare const __dirname: string;
declare function require(moduleName: 'fs'): {
  readFileSync: (filePath: string, encoding: 'utf8') => string;
};

const readFileSync = require('fs').readFileSync;
const root = `${__dirname}/../../..`;
const migration = readFileSync(
  `${root}/supabase/migrations/20260927150000_tide_line_schema.sql`,
  'utf8',
);
const seed = readFileSync(`${root}/supabase/seed.sql`, 'utf8');

const tables = [
  'adults',
  'child_profiles',
  'whales',
  'fluke_images',
  'sightings',
  'follows',
  'badges',
  'child_badges',
  'quests',
  'quest_completions',
  'whale_tales',
  'ocean_dex_entries',
  'classes',
  'class_members',
  'adoption_tiers',
  'adoptions',
];

test('every table forces row level security', () => {
  for (const table of tables) {
    expect(migration).toContain(`alter table public.${table} enable row level security;`);
    expect(migration).toContain(`alter table public.${table} force row level security;`);
  }
});

test('the public sightings view rounds coordinates and hides early reviews', () => {
  expect(migration).toContain('round(decimal_latitude::numeric, 2)');
  expect(migration).toContain('round(decimal_longitude::numeric, 2)');
  expect(migration).toContain("verification_status in ('research_grade', 'published')");
});

test('quest completions have no location columns', () => {
  const start = migration.indexOf('create table public.quest_completions');
  const end = migration.indexOf('create table public.whale_tales');
  const table = migration.slice(start, end);

  expect(table).toContain('completed_on date not null');
  expect(table).not.toContain('decimal_latitude');
  expect(table).not.toContain('decimal_longitude');
  expect(table).not.toContain('location');
});

test('the local seed has the sample catalog and no secrets', () => {
  expect(seed.match(/SAMPLE-00[1-5]/g)).toHaveLength(5);
  expect(seed).toContain('generate_series(1, 20)');
  expect(seed).toContain('A tail like a fingerprint');
  expect(seed).toContain('The harbor visitors');
  expect(seed).toContain('Quiet looking');
  expect(seed).toContain('Harbor path');
  expect(seed).toContain('Bridge park');
  expect(seed).toContain('Draw a fluke');
  expect(seed).toContain('Read a tale');
  expect(seed).toContain('Ocean minute');
  const badges = seed.slice(seed.indexOf('insert into public.badges'));
  expect(badges.match(/^\s+\('/gm)).toHaveLength(10);
  expect(seed).not.toContain('service_role');
  expect(seed).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
});
