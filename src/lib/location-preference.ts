import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type LocationPreference = {
  locationEnabled: boolean;
  setLocationEnabled: (enabled: boolean) => void;
};

export const useLocationPreference = create<LocationPreference>()(
  persist(
    (set) => ({
      locationEnabled: false,
      setLocationEnabled: (locationEnabled) => set({ locationEnabled }),
    }),
    {
      name: 'tideline-location',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
