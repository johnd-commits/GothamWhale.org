import { Stack } from 'expo-router';
import { Platform } from 'react-native';

import { BigLink } from '@/components/big-link';
import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { useSoundPreference } from '@/lib/sound-preference';
import { toggleSoundEnabled } from '@/theme/motion';

export default function GrownUpsScreen() {
  const soundEnabled = useSoundPreference((state) => state.soundEnabled);
  const setSoundEnabled = useSoundPreference((state) => state.setSoundEnabled);

  return (
    <>
      <Stack.Screen options={{ title: 'Grown-ups' }} />
      <InfoScreen message="This area is for parents and teachers. Kids do not make accounts.">
        <SquishButton
          label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
          sound={false}
          onPress={() => setSoundEnabled(toggleSoundEnabled(soundEnabled))}
        />
        <BigLink href="/observer" label="Observer mode" />
        <BigLink href="/dev" label="Component preview" />
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
