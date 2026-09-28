import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { BigLink } from '@/components/big-link';
import { ChoiceList } from '@/components/choice-list';
import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { createChildProfile } from '@/lib/adult-account';
import { noteAdultSession } from '@/lib/adult-session';
import { ageBands, avatars, nicknames } from '@/lib/child-options';
import { createSupabaseAdultAuth } from '@/lib/supabase-adult-auth';
import { getSupabaseClient } from '@/lib/supabase';
import { useProfileVersion } from '@/lib/use-family';
import { colors, font } from '@/theme/tokens';

export default function AddChildScreen() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [ageBand, setAgeBand] = useState<string | null>(null);
  const [message, setMessage] = useState('Pick a nickname, an avatar, and an age band. No typing.');

  async function saveProfile() {
    const auth = createSupabaseAdultAuth();
    const client = getSupabaseClient();
    if (!auth || !client) {
      setMessage(
        'Save did not keep this profile. This website has no database connection yet. Add the public Supabase address and anon key in Vercel, then publish again.',
      );
      return;
    }
    const { data } = await client.auth.getSession();
    let adultId = data.session?.user.id ?? null;
    if (!adultId) {
      const user = await client.auth.getUser();
      adultId = user.data.user?.id ?? null;
    }
    if (!adultId) {
      setMessage('The grown-up email sign-in did not stay on. Use Grown-up account, then come back.');
      return;
    }
    noteAdultSession(true);
    if (!nickname || !avatar || !ageBand) {
      setMessage('Pick a nickname, an avatar, and an age band.');
      return;
    }
    const result = await createChildProfile(auth, adultId, { nickname, avatar, ageBand });
    if (result.error || !result.profile) {
      setMessage('The profile was not saved.');
      return;
    }
    useProfileVersion.getState().bump();
    setMessage(`${result.profile.nickname} is ready.`);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Add a child' }} />
      <InfoScreen title="Add a child" message={message} scroll>
        <ChoiceList label="Nickname" options={nicknames} value={nickname} onChange={setNickname} />
        <ChoiceList label="Avatar" options={avatars} value={avatar} onChange={setAvatar} />
        <ChoiceList label="Age band" options={ageBands} value={ageBand} onChange={setAgeBand} />
        <Text style={styles.result}>{message}</Text>
        <SquishButton label="Save this profile" onPress={() => void saveProfile()} />
        <BigLink href="/grown-ups" label="Grown-up menu" />
      </InfoScreen>
    </>
  );
}

const styles = StyleSheet.create({
  result: {
    color: colors.ink,
    fontFamily: font.semibold,
    fontSize: 18,
  },
});
