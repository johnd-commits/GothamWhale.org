import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { registerAdult, sendPasswordReset, signInAdult } from '@/lib/adult-account';
import { placeholderConsentProvider, privacyNotice } from '@/lib/consent';
import { usePinGate } from '@/lib/pin-gate';
import { getSupabaseClient } from '@/lib/supabase';
import { createSupabaseAdultAuth } from '@/lib/supabase-adult-auth';
import { colors, font, radius, tapTarget } from '@/theme/tokens';

const signInIntro =
  'Sign in with your email and password. After that, you choose a 4-number PIN for this browser. That PIN is not your password, and Tide Line does not know it until you pick it.';

export default function SignUpScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'sign-in' | 'create' | 'forgot'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [message, setMessage] = useState(signInIntro);
  const auth = createSupabaseAdultAuth();
  const forgotDevicePin = usePinGate((state) => state.forgotDevicePin);

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
        if (cancelled) {
          return;
        }
        if (forgotDevicePin) {
          router.replace('/grown-ups');
          return;
        }
        setMessage('Signed in. You can add a child profile.');
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
  }, [forgotDevicePin, router]);

  function showMode(next: 'sign-in' | 'create' | 'forgot') {
    setMode(next);
    setPassword('');
    setPasswordAgain('');
    if (next === 'sign-in') {
      setMessage(signInIntro);
      return;
    }
    if (next === 'create') {
      setMessage(privacyNotice);
      return;
    }
    setMessage('Enter your email. A link will let you choose a new password.');
  }

  async function createAccount() {
    if (!auth) {
      setMessage(
        'This website has no database connection yet. Add the public Supabase address and anon key in Vercel, then publish again.',
      );
      return;
    }
    const result = await registerAdult(auth, {
      email,
      password,
      passwordAgain,
      acceptedNotice: true,
    });
    if (result.status === 'ready') {
      router.replace('/grown-ups');
      return;
    }
    if (result.status === 'confirm-email') {
      setMessage(
        'Look in your inbox and spam for the confirmation link. If you already opened that link, use Sign in.',
      );
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
      router.replace('/grown-ups');
      return;
    }
    if (result.status === 'error') {
      setMessage(result.message);
      return;
    }
    setMessage(privacyNotice);
  }

  async function sendReset() {
    if (!auth) {
      setMessage(
        'This website has no database connection yet. Add the public Supabase address and anon key in Vercel, then publish again.',
      );
      return;
    }
    const result = await sendPasswordReset(auth, email);
    if (result.status === 'sent') {
      setMessage('If this email has an account, a reset link is on the way. Check your inbox and spam.');
      return;
    }
    setMessage(result.message);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Grown-up account' }} />
      <InfoScreen title="Grown-up account" message={message} scroll>
        <Text style={styles.label}>Email</Text>
        <TextInput
          accessibilityLabel="Email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        {mode === 'forgot' ? null : (
          <>
            <Text style={styles.label}>Password</Text>
            <TextInput
              accessibilityLabel="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
          </>
        )}
        {mode === 'create' ? (
          <>
            <Text style={styles.label}>Password again</Text>
            <TextInput
              accessibilityLabel="Password again"
              secureTextEntry
              value={passwordAgain}
              onChangeText={setPasswordAgain}
              style={styles.input}
            />
          </>
        ) : null}
        {mode === 'sign-in' ? (
          <>
            <SquishButton label="Sign in" onPress={() => void signIn()} />
            <SquishButton label="I forgot my password" sound={false} onPress={() => showMode('forgot')} />
            <SquishButton label="Create an account" sound={false} onPress={() => showMode('create')} />
          </>
        ) : null}
        {mode === 'create' ? (
          <>
            <SquishButton label="I agree. Create my account." onPress={() => void createAccount()} />
            <SquishButton label="Back to sign in" sound={false} onPress={() => showMode('sign-in')} />
          </>
        ) : null}
        {mode === 'forgot' ? (
          <>
            <SquishButton label="Send a reset link" onPress={() => void sendReset()} />
            <SquishButton label="Back to sign in" sound={false} onPress={() => showMode('sign-in')} />
          </>
        ) : null}
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
