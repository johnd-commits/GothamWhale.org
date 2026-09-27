import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ActiveChild = {
  activeChildId: string | null;
  setActiveChildId: (childId: string | null) => void;
};

export const useActiveChild = create<ActiveChild>()(
  persist(
    (set) => ({
      activeChildId: null,
      setActiveChildId: (activeChildId) => set({ activeChildId }),
    }),
    {
      name: 'tideline-active-child',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
