import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type NoticePreference = {
  noticesEnabled: boolean;
  setNoticesEnabled: (enabled: boolean) => void;
};

export const useNoticePreference = create<NoticePreference>()(
  persist(
    (set) => ({
      noticesEnabled: false,
      setNoticesEnabled: (noticesEnabled) => set({ noticesEnabled }),
    }),
    {
      name: 'tideline-notices',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
