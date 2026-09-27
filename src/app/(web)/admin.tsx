import { Stack } from 'expo-router';

import { InfoScreen } from '@/components/info-screen';

export default function AdminScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Science review' }} />
      <InfoScreen message="Researchers will check whale photos here." />
    </>
  );
}
