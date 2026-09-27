import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { deleteChildProfile } from '@/lib/adult-account';
import { useActiveChild } from '@/lib/active-child';
import type { ChildProfileRecord } from '@/lib/child-records';
import { createSupabaseAdultAuth } from '@/lib/supabase-adult-auth';
import { useProfileVersion } from '@/lib/use-family';

export default function DeleteChildScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ childId?: string }>();
  const childId = typeof params.childId === 'string' ? params.childId : '';
  const activeChildId = useActiveChild((state) => state.activeChildId);
  const setActiveChildId = useActiveChild((state) => state.setActiveChildId);
  const [profile, setProfile] = useState<ChildProfileRecord | null>(null);
  const [message, setMessage] = useState('Delete this child\'s data? This cannot be undone.');

  useEffect(() => {
    const auth = createSupabaseAdultAuth();
    if (!auth || !childId) {
      return;
    }
    void auth.listChildren().then((profiles) => {
      setProfile(profiles.find((item) => item.id === childId) ?? null);
    });
  }, [childId]);

  async function confirmDelete() {
    const auth = createSupabaseAdultAuth();
    if (!auth || !childId) {
      setMessage('This profile could not be deleted.');
      return;
    }
    const error = await deleteChildProfile(auth, childId);
    if (error) {
      setMessage('This profile could not be deleted.');
      return;
    }
    if (activeChildId === childId) {
      setActiveChildId(null);
    }
    useProfileVersion.getState().bump();
    router.replace('/grown-ups');
  }

  const nickname = profile?.nickname ?? 'this child';

  return (
    <>
      <Stack.Screen options={{ title: 'Delete data' }} />
      <InfoScreen title="Delete data" message={message}>
        <SquishButton label={`Keep ${nickname}`} onPress={() => router.back()} />
        <SquishButton label="Delete this child's data" onPress={() => void confirmDelete()} />
      </InfoScreen>
    </>
  );
}
