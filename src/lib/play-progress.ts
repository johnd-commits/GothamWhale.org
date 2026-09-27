import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ChildProgress } from '@/lib/badges';
import { highAccuracyFlag } from '@/lib/fluke-match';

const emptyProgress: ChildProgress = {
  follows: 0,
  flukeCorrect: 0,
  calmMinutes: 0,
  talesRead: 0,
  questsCompleted: 0,
  placeQuestsCompleted: 0,
  dexCards: 0,
  acknowledgedDistance: false,
  parentVerifiedSightings: 0,
  daysActive: 1,
};

type PlayProgressState = ChildProgress & {
  followedWhaleIds: string[];
  flukeAttempts: number;
  carefulMatcher: boolean;
  followWhale: (whaleId: string) => void;
  recordFluke: (correct: boolean) => void;
  addCalm: (minutes: number) => void;
  addTale: () => void;
  addQuest: (place: boolean) => void;
  addDex: () => void;
  addParentSighting: () => void;
  acknowledgeDistance: () => void;
};

export const usePlayProgress = create<PlayProgressState>()(
  persist(
    (set) => ({
      ...emptyProgress,
      followedWhaleIds: [],
      flukeAttempts: 0,
      carefulMatcher: false,
      followWhale: (whaleId) =>
        set((state) => {
          if (state.followedWhaleIds.includes(whaleId)) {
            return state;
          }
          const followedWhaleIds = [...state.followedWhaleIds, whaleId];
          return { followedWhaleIds, follows: followedWhaleIds.length };
        }),
      recordFluke: (correct) =>
        set((state) => {
          const flukeAttempts = state.flukeAttempts + 1;
          const flukeCorrect = state.flukeCorrect + (correct ? 1 : 0);
          return {
            flukeAttempts,
            flukeCorrect,
            carefulMatcher: highAccuracyFlag(flukeAttempts, flukeCorrect),
          };
        }),
      addCalm: (minutes) => set((state) => ({ calmMinutes: state.calmMinutes + minutes })),
      addTale: () => set((state) => ({ talesRead: state.talesRead + 1 })),
      addQuest: (place) =>
        set((state) => ({
          questsCompleted: state.questsCompleted + 1,
          placeQuestsCompleted: state.placeQuestsCompleted + (place ? 1 : 0),
          acknowledgedDistance: state.acknowledgedDistance || place,
        })),
      addDex: () => set((state) => ({ dexCards: state.dexCards + 1 })),
      addParentSighting: () =>
        set((state) => ({
          parentVerifiedSightings: state.parentVerifiedSightings + 1,
          dexCards: state.dexCards + 1,
        })),
      acknowledgeDistance: () => set({ acknowledgedDistance: true }),
    }),
    {
      name: 'tideline-progress',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
