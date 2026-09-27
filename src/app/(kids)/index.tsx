import { StyleSheet, Text, View } from 'react-native';

import { BigLink } from '@/components/big-link';
import { InfoScreen } from '@/components/info-screen';
import { ProfileSwitcher } from '@/components/profile-switcher';
import { topExplorer } from '@/lib/badges';
import { usePlayProgress } from '@/lib/play-progress';
import { useFamilyProfiles } from '@/lib/use-family';
import { colors, font } from '@/theme/tokens';

export default function HomeScreen() {
  const { profiles, activeChildId, setActiveChildId } = useFamilyProfiles();
  const follows = usePlayProgress((state) => state.follows);
  const explorer = usePlayProgress((state) => topExplorer(state));

  return (
    <InfoScreen title="Home" message="Hello! Ready to visit the harbor?" scroll>
      <View accessibilityLabel="Underwater harbor" style={styles.harbor}>
        <Text style={styles.harborText}>
          {follows === 0 ? 'The harbor is quiet.' : `You follow ${follows} whales.`}
        </Text>
        {explorer ? <Text style={styles.harborText}>Top explorer</Text> : null}
      </View>
      <ProfileSwitcher
        profiles={profiles}
        activeId={activeChildId}
        onSelect={setActiveChildId}
      />
      <BigLink href="/grown-ups" label="Grown-ups" />
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  harbor: {
    minHeight: 88,
    borderRadius: 24,
    backgroundColor: colors.sky,
    justifyContent: 'center',
    padding: 16,
  },
  harborText: {
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 22,
  },
});
