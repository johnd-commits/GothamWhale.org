import { Stack } from 'expo-router';
import { Platform } from 'react-native';

import { BigLink } from '@/components/big-link';
import { InfoScreen } from '@/components/info-screen';

export default function GrownUpsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Grown-ups' }} />
      <InfoScreen message="This area is for parents and teachers. Kids do not make accounts.">
        <BigLink href="/observer" label="Observer mode" />
        {Platform.OS === 'web' ? (
          <BigLink href="/teacher" label="Teacher desk" />
        ) : null}
        {Platform.OS === 'web' ? <BigLink href="/admin" label="Science review" /> : null}
        {Platform.OS === 'web' ? <BigLink href="/map" label="Whale map" /> : null}
        {Platform.OS === 'web' ? <BigLink href="/donate" label="Adopt a whale" /> : null}
      </InfoScreen>
    </>
  );
}
