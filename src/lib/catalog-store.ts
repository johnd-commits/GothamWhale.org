import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { starterCatalog, type CatalogRecord } from '@/lib/catalog';

type CatalogState = {
  added: CatalogRecord[];
  addRecord: (record: CatalogRecord) => void;
};

export const useCatalog = create<CatalogState>()(
  persist(
    (set) => ({
      added: [],
      addRecord: (record) => set((state) => ({ added: [record, ...state.added] })),
    }),
    {
      name: 'tideline-catalog',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function catalogRecords(added: CatalogRecord[]): CatalogRecord[] {
  return [...added, ...starterCatalog];
}
