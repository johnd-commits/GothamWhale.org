import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

const URL_ENV = 'EXPO_PUBLIC_SUPABASE_URL';
const ANON_ENV = 'EXPO_PUBLIC_SUPABASE_ANON_KEY';

export function readSupabasePublicConfig(
  env: Record<string, string | undefined> = process.env,
): SupabasePublicConfig | null {
  const url = env[URL_ENV]?.trim();
  const anonKey = env[ANON_ENV]?.trim();
  if (!url || !anonKey) {
    return null;
  }
  return { url, anonKey };
}

export function createSupabaseClient(config: SupabasePublicConfig): SupabaseClient {
  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) {
    return cachedClient;
  }
  const config = readSupabasePublicConfig();
  if (!config) {
    return null;
  }
  cachedClient = createSupabaseClient(config);
  return cachedClient;
}
