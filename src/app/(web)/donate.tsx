import { Stack } from 'expo-router';

import { InfoScreen } from '@/components/info-screen';

export default function DonateScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Adopt a whale' }} />
      <InfoScreen message="This page is for grown-ups. Kids do not see purchase buttons in the app." />
    </>
  );
}
