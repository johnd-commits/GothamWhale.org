import { Stack } from 'expo-router';

import { InfoScreen } from '@/components/info-screen';

export default function ObserverScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Observer' }} />
      <InfoScreen message="Observer mode is for grown-ups. You will send whale sightings from here later. Stay at least 100 yards from whales." />
    </>
  );
}
