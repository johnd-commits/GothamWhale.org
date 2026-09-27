import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

// Expo inlines only a direct process.env.EXPO_PUBLIC_* read. A lookup by
// variable name stays empty in the published website.
const publicUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publicAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export function readSupabasePublicConfig(
  env: Record<string, string | undefined> = {
    EXPO_PUBLIC_SUPABASE_URL: publicUrl,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: publicAnonKey,
  },
): SupabasePublicConfig | null {
  const url = env.EXPO_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    return null;
  }
  return { url, anonKey };
}

export function createSupabaseClient(config: SupabasePublicConfig): SupabaseClient {
  return createClient(config.url, config.anonKey, {
    auth: {
      storage: AsyncStorage,
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
