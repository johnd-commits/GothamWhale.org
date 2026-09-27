import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { registerAdult, signInAdult } from '@/lib/adult-account';
import { placeholderConsentProvider, privacyNotice } from '@/lib/consent';
import { getSupabaseClient } from '@/lib/supabase';
import { createSupabaseAdultAuth } from '@/lib/supabase-adult-auth';
import { colors, font, radius, tapTarget } from '@/theme/tokens';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(privacyNotice);
  const auth = createSupabaseAdultAuth();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const sessionAuth = createSupabaseAdultAuth();
      const supabase = getSupabaseClient();
      if (!sessionAuth || !supabase) {
        return;
      }
      const { data } = await supabase.auth.getSession();
      const adultId = data.session?.user.id;
      if (!adultId || cancelled) {
        return;
      }
      if (await sessionAuth.hasAdultRow(adultId)) {
        if (!cancelled) {
          setMessage('Signed in. You can add a child profile.');
        }
        return;
      }
      const decision = await placeholderConsentProvider.requestConsent(true);
      if (!decision || cancelled) {
        return;
      }
      const error = await sessionAuth.insertAdult(adultId, decision);
      if (!cancelled) {
        setMessage(
          error ? 'Consent was not saved.' : 'Your email is confirmed. You can add a child profile.',
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
      setMessage('Look in your inbox and spam for the confirmation link. If you already opened that link, use Sign in.');
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
