import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { registerAdult, signInAdult } from '@/lib/adult-account';
import { privacyNotice } from '@/lib/consent';
import { createSupabaseAdultAuth } from '@/lib/supabase-adult-auth';
import { colors, font, radius, tapTarget } from '@/theme/tokens';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(privacyNotice);
  const auth = createSupabaseAdultAuth();

  async function createAccount() {
    if (!auth) {
      setMessage(
        'This website has no database connection yet. Add the public Supabase address and anon key in Vercel, then publish again.',
      );
      return;
    }
    const result = await registerAdult(auth, { email, password, acceptedNotice: true });
    if (result.status === 'ready') {
      setMessage('Account ready. You can add a child profile.');
      return;
    }
    if (result.status === 'confirm-email') {
      setMessage('Check your email, then come back and sign in.');
      return;
    }
    if (result.status === 'need-consent') {
      setMessage(privacyNotice);
      return;
    }
    setMessage(result.message);
  }

  async function signIn() {
    if (!auth) {
      setMessage(
        'This website has no database connection yet. Add the public Supabase address and anon key in Vercel, then publish again.',
      );
      return;
    }
    const result = await signInAdult(auth, { email, password, acceptedNotice: true });
    if (result.status === 'ready') {
      setMessage('Signed in.');
      return;
    }
    if (result.status === 'error') {
      setMessage(result.message);
      return;
    }
    setMessage(privacyNotice);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Grown-up account' }} />
      <InfoScreen title="Grown-up account" message={message} scroll>
        <TextInput
          accessibilityLabel="Email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          accessibilityLabel="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <SquishButton label="I agree. Create my account." onPress={() => void createAccount()} />
        <SquishButton label="I agree. Sign in." onPress={() => void signIn()} />
      </InfoScreen>
    </>
  );
}

const styles = StyleSheet.create({
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
