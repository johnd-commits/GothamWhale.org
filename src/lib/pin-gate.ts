import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type PinGateState = {
  pinHash: string | null;
  unlocked: boolean;
  setPinHash: (pinHash: string) => void;
  unlock: () => void;
  lock: () => void;
};

export const usePinGate = create<PinGateState>()(
  persist(
    (set) => ({
      pinHash: null,
      unlocked: false,
      setPinHash: (pinHash) => set({ pinHash, unlocked: true }),
      unlock: () => set({ unlocked: true }),
      lock: () => set({ unlocked: false }),
    }),
    {
      name: 'tideline-pin',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ pinHash: state.pinHash }),
    },
  ),
);
