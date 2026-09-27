import type { AdultAuth } from '@/lib/adult-account';
import { emailConfirmationRedirect } from '@/lib/auth-redirect';
import { isAgeBand, isAvatar, isNickname } from '@/lib/child-options';
import type { ChildProfileRecord } from '@/lib/child-records';
import type { ConsentDecision } from '@/lib/consent';
import { getSupabaseClient } from '@/lib/supabase';

function isChildRow(value: unknown): value is {
  id: string;
  nickname: string;
  avatar: string;
  age_band: string;
} {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    typeof row.nickname === 'string' &&
    typeof row.avatar === 'string' &&
    typeof row.age_band === 'string'
  );
}

export function createSupabaseAdultAuth(): AdultAuth | null {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  return {
    async signUp(email, password) {
      const emailRedirectTo = emailConfirmationRedirect(
        typeof window !== 'undefined' ? window.location.origin : undefined,
      );
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: emailRedirectTo ? { emailRedirectTo } : undefined,
      });
      return {
        userId: data.user?.id ?? null,
        hasSession: data.session !== null,
        error: error?.message ?? null,
      };
    },
    async signIn(email, password) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      return {
        userId: data.user?.id ?? null,
        error: error?.message ?? null,
      };
    },
    async hasAdultRow(adultId) {
      const { data, error } = await client.from('adults').select('id').eq('id', adultId).maybeSingle();
      return !error && data !== null;
    },
    async insertAdult(adultId, consent: ConsentDecision) {
      const { error } = await client.from('adults').insert({
        id: adultId,
        role: 'parent',
        consent_status: consent.status,
        consent_at: consent.consentedAt,
      });
      return error?.message ?? null;
    },
    async listChildren() {
      const { data, error } = await client
        .from('child_profiles')
        .select('id, nickname, avatar, age_band');
      if (error || !Array.isArray(data)) {
        return [];
      }
      const profiles: ChildProfileRecord[] = [];
      for (const row of data) {
        if (!isChildRow(row) || !isNickname(row.nickname) || !isAvatar(row.avatar) || !isAgeBand(row.age_band)) {
          continue;
        }
        profiles.push({
          id: row.id,
          nickname: row.nickname,
          avatar: row.avatar,
          ageBand: row.age_band,
        });
      }
      return profiles;
    },
    async insertChild(input) {
      const { data, error } = await client
        .from('child_profiles')
        .insert({
          adult_id: input.adultId,
          nickname: input.nickname,
          avatar: input.avatar,
          age_band: input.ageBand,
        })
        .select('id, nickname, avatar, age_band')
        .single();
      if (error || !isChildRow(data)) {
        return { profile: null, error: error?.message ?? 'The profile was not saved.' };
      }
      return {
        profile: {
          id: data.id,
          nickname: data.nickname,
          avatar: data.avatar,
          ageBand: data.age_band,
        },
        error: null,
      };
    },
    async deleteChild(childId) {
      const { error } = await client.from('child_profiles').delete().eq('id', childId);
      return error?.message ?? null;
    },
  };
}
