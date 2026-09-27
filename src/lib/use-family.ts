import { useEffect, useState } from 'react';
import { create } from 'zustand';

import { useActiveChild } from '@/lib/active-child';
import { chooseActiveChild, type ChildProfileRecord } from '@/lib/child-records';
import { createSupabaseAdultAuth } from '@/lib/supabase-adult-auth';
import { getSupabaseClient } from '@/lib/supabase';

export const useProfileVersion = create<{ version: number; bump: () => void }>((set) => ({
  version: 0,
  bump: () => set((state) => ({ version: state.version + 1 })),
}));

export function useFamilyProfiles() {
  const [profiles, setProfiles] = useState<ChildProfileRecord[]>([]);
  const activeChildId = useActiveChild((state) => state.activeChildId);
  const setActiveChildId = useActiveChild((state) => state.setActiveChildId);

  useEffect(() => {
    const auth = createSupabaseAdultAuth();
    const client = getSupabaseClient();
    if (!auth || !client) {
      return;
    }

    let ignore = false;
    const load = () => {
      void auth.listChildren().then((next) => {
        if (ignore) {
          return;
        }
        setProfiles(next);
        setActiveChildId(
          chooseActiveChild(
            next.map((profile) => profile.id),
            useActiveChild.getState().activeChildId,
          ),
        );
      });
    };

    const { data } = client.auth.onAuthStateChange(load);
    const unsubscribe = useProfileVersion.subscribe(load);

    return () => {
      ignore = true;
      data.subscription.unsubscribe();
      unsubscribe();
    };
  }, [setActiveChildId]);

  return { profiles, activeChildId, setActiveChildId };
}
