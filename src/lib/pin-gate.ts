import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type PinGateState = {
  pinHash: string | null;
  unlocked: boolean;
  forgotDevicePin: boolean;
  setPinHash: (pinHash: string) => void;
  unlock: () => void;
  lock: () => void;
  requestPinReset: () => void;
};

export const usePinGate = create<PinGateState>()(
  persist(
    (set) => ({
      pinHash: null,
      unlocked: false,
      forgotDevicePin: false,
      setPinHash: (pinHash) => set({ pinHash, unlocked: true, forgotDevicePin: false }),
      unlock: () => set({ unlocked: true }),
      lock: () => set({ unlocked: false }),
      requestPinReset: () => set({ forgotDevicePin: true, unlocked: false }),
    }),
    {
      name: 'tideline-pin',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ pinHash: state.pinHash }),
    },
  ),
);
