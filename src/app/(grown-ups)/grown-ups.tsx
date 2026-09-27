import { Stack, useRouter } from 'expo-router';
import { Platform } from 'react-native';

import { BigLink } from '@/components/big-link';
import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { earnedBadgeSlugs } from '@/lib/badges';
import { useLocationPreference } from '@/lib/location-preference';
import { useNoticePreference } from '@/lib/notice-preference';
import { usePlayProgress } from '@/lib/play-progress';
import { useSoundPreference } from '@/lib/sound-preference';
import { useFamilyProfiles } from '@/lib/use-family';
import { toggleSoundEnabled } from '@/theme/motion';

export default function GrownUpsScreen() {
  const router = useRouter();
  const soundEnabled = useSoundPreference((state) => state.soundEnabled);
  const setSoundEnabled = useSoundPreference((state) => state.setSoundEnabled);
  const noticesEnabled = useNoticePreference((state) => state.noticesEnabled);
  const setNoticesEnabled = useNoticePreference((state) => state.setNoticesEnabled);
  const locationEnabled = useLocationPreference((state) => state.locationEnabled);
  const setLocationEnabled = useLocationPreference((state) => state.setLocationEnabled);
  const badgeCount = usePlayProgress((state) => earnedBadgeSlugs(state).length);
  const parentSightings = usePlayProgress((state) => state.parentVerifiedSightings);
  const { profiles } = useFamilyProfiles();

  return (
    <>
      <Stack.Screen options={{ title: 'Grown-ups' }} />
      <InfoScreen
        message={`This area is for parents and teachers. Kids do not make accounts. Badges on this device: ${badgeCount}. Checked sightings: ${parentSightings}.`}
        scroll
      >
        <SquishButton
          label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
          sound={false}
          onPress={() => setSoundEnabled(toggleSoundEnabled(soundEnabled))}
        />
        <SquishButton
          label={noticesEnabled ? 'Turn notices off' : 'Turn notices on'}
          sound={false}
          onPress={() => setNoticesEnabled(!noticesEnabled)}
        />
        <SquishButton
          label={locationEnabled ? 'Turn quest location off' : 'Allow quest location'}
          sound={false}
          onPress={() => setLocationEnabled(!locationEnabled)}
        />
        <BigLink href="/signup" label="Grown-up account" />
        <BigLink href="/add-child" label="Add a child" />
        {profiles.map((profile) => (
          <SquishButton
            key={profile.id}
            label={`Delete ${profile.nickname}`}
            onPress={() =>
              router.push({
                pathname: '/delete-child',
                params: { childId: profile.id },
              })
            }
          />
        ))}
        <BigLink href="/catalog" label="Whale catalog" />
        <BigLink href="/observer" label="Observer mode" />
        <BigLink href="/dev" label="Component preview" />
        {Platform.OS === 'web' ? <BigLink href="/teacher" label="Teacher desk" /> : null}
        {Platform.OS === 'web' ? <BigLink href="/admin" label="Science review" /> : null}
        {Platform.OS === 'web' ? <BigLink href="/map" label="Whale map" /> : null}
        {Platform.OS === 'web' ? <BigLink href="/donate" label="Adopt a whale" /> : null}
      </InfoScreen>
    </>
  );
}
