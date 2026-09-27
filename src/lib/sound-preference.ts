import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SoundPreference = {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
};

export const useSoundPreference = create<SoundPreference>()(
  persist(
    (set) => ({
      soundEnabled: true,
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
    }),
    {
      name: 'tideline-sound',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
