import { useEffect, useState, useSyncExternalStore } from 'react';
import { Redirect, Stack, usePathname } from 'expo-router';

import { PinLock } from '@/components/pin-lock';
import { usePinGate } from '@/lib/pin-gate';
import { isAccountRoute } from '@/lib/routes';
import { getSupabaseClient } from '@/lib/supabase';
import { colors } from '@/theme/tokens';

function usePinHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => usePinGate.persist.onFinishHydration(onStoreChange),
    () => usePinGate.persist.hasHydrated(),
    () => false,
  );
}

export default function GrownUpsLayout() {
  const pathname = usePathname();
  const unlocked = usePinGate((state) => state.unlocked);
  const forgotDevicePin = usePinGate((state) => state.forgotDevicePin);
  const lock = usePinGate((state) => state.lock);
  const hydrated = usePinHydrated();
  const [sessionReady, setSessionReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    return () => {
      lock();
    };
  }, [lock]);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setSessionReady(true);
      return;
    }
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setSignedIn(session !== null);
      setSessionReady(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (!hydrated || !sessionReady) {
    return null;
  }

  if (!isAccountRoute(pathname) && !signedIn) {
    return <Redirect href="/signup" />;
  }

  if (!isAccountRoute(pathname) && !unlocked) {
    return <PinLock replacing={forgotDevicePin} />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.mist },
        headerTintColor: colors.ink,
        contentStyle: { backgroundColor: colors.foam },
      }}
    />
  );
}
