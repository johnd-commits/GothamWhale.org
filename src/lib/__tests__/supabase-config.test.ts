import { readSupabasePublicConfig } from '../supabase';

test('returns null until both public env values are set', () => {
  expect(readSupabasePublicConfig({})).toBeNull();
  expect(
    readSupabasePublicConfig({
      EXPO_PUBLIC_SUPABASE_URL: 'https://dev.example.supabase.co',
    }),
  ).toBeNull();
});

test('reads only the public anon key', () => {
  const config = readSupabasePublicConfig({
    EXPO_PUBLIC_SUPABASE_URL: 'https://dev.example.supabase.co',
    EXPO_PUBLIC_SUPABASE_ANON_KEY: 'public-anon',
    SUPABASE_SERVICE_ROLE_KEY: 'do-not-ship',
  });

  expect(config).toEqual({
    url: 'https://dev.example.supabase.co',
    anonKey: 'public-anon',
  });
  expect(JSON.stringify(config)).not.toContain('do-not-ship');
});
