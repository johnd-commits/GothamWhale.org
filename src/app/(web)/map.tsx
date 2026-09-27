import { Stack } from 'expo-router';

import { InfoScreen } from '@/components/info-screen';

export default function MapScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Whale map' }} />
      <InfoScreen message="Later this map shows sightings rounded so the exact spot stays private." />
    </>
  );
}
