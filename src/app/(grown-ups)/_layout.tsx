import { useEffect, useSyncExternalStore } from 'react';
import { Stack } from 'expo-router';

import { PinLock } from '@/components/pin-lock';
import { usePinGate } from '@/lib/pin-gate';
import { colors } from '@/theme/tokens';

function usePinHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => usePinGate.persist.onFinishHydration(onStoreChange),
    () => usePinGate.persist.hasHydrated(),
    () => false,
  );
}

export default function GrownUpsLayout() {
  const unlocked = usePinGate((state) => state.unlocked);
  const lock = usePinGate((state) => state.lock);
  const hydrated = usePinHydrated();

  useEffect(() => {
    return () => {
      lock();
    };
  }, [lock]);

  if (!hydrated) {
    return null;
  }

  if (!unlocked) {
    return <PinLock />;
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
