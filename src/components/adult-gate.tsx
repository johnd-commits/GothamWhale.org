import { type ReactNode, useSyncExternalStore } from 'react';

import { InfoScreen } from '@/components/info-screen';
import { PinLock } from '@/components/pin-lock';
import { usePinGate } from '@/lib/pin-gate';

type AdultGateProps = {
  children: ReactNode;
};

export function AdultGate({ children }: AdultGateProps) {
  const hydrated = useSyncExternalStore(
    usePinGate.persist.onFinishHydration,
    usePinGate.persist.hasHydrated,
    () => false,
  );
  const unlocked = usePinGate((state) => state.unlocked);

  if (!hydrated) {
    return <InfoScreen message="Checking the grown-up lock." />;
  }

  if (!unlocked) {
    return <PinLock />;
  }

  return children;
}
