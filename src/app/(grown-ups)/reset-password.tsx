import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { saveNewPassword } from '@/lib/adult-account';
import { getSupabaseClient } from '@/lib/supabase';
import { createSupabaseAdultAuth } from '@/lib/supabase-adult-auth';
import { colors, font, radius, tapTarget } from '@/theme/tokens';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('Open the reset link from your email in this browser.');

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage(
        'This website has no database connection yet. Add the public Supabase address and anon key in Vercel, then publish again.',
      );
      return;
    }
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        setReady(true);
        setMessage('Choose a new password. Enter it twice.');
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  async function savePassword() {
    const auth = createSupabaseAdultAuth();
    if (!auth || !ready) {
      setMessage('Open the reset link from your email in this browser.');
      return;
    }
    const result = await saveNewPassword(auth, password, passwordAgain);
    if (result.status === 'saved') {
      router.replace('/grown-ups');
      return;
    }
    setMessage(result.message);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'New password' }} />
      <InfoScreen title="New password" message={message} scroll>
        <Text style={styles.label}>New password</Text>
        <TextInput
          accessibilityLabel="New password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <Text style={styles.label}>New password again</Text>
        <TextInput
          accessibilityLabel="New password again"
          secureTextEntry
          value={passwordAgain}
          onChangeText={setPasswordAgain}
          style={styles.input}
        />
        <SquishButton label="Save the new password" onPress={() => void savePassword()} />
      </InfoScreen>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.ink,
    fontFamily: font.semibold,
    fontSize: 18,
  },
  input: {
    minHeight: tapTarget,
    borderWidth: 3,
    borderColor: colors.mist,
    borderRadius: radius.button,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 18,
  },
});
