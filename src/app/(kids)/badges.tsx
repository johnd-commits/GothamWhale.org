import { StyleSheet, Text, View } from 'react-native';

import { InfoScreen } from '@/components/info-screen';
import { earnedBadgeSlugs, topExplorer } from '@/lib/badges';
import { usePlayProgress } from '@/lib/play-progress';
import { colors, font } from '@/theme/tokens';

const badgeNames: Record<string, string> = {
  'first-follow': 'First Follow',
  'five-follows': 'Five Follows',
  'fluke-finder': 'Fluke Finder',
  'calm-minute': 'Calm Minute',
  'tale-reader': 'Tale Reader',
  'quest-starter': 'Quest Starter',
  'harbor-helper': 'Harbor Helper',
  'grown-up-trip': 'Grown-up Trip',
  'dex-collector': 'Dex Collector',
  'gentle-watcher': 'Gentle Watcher',
};

export default function BadgesScreen() {
  const progress = usePlayProgress();
  const earned = earnedBadgeSlugs(progress);
  const explorer = topExplorer(progress);

  return (
    <InfoScreen
      title="Badges"
      message={
        earned.length === 0
          ? 'Your shelf is ready. Follow a whale or play a game to earn the first one.'
          : explorer
            ? 'Top explorer on this device.'
            : 'These badges stay on this device.'
      }
      scroll
    >
      <View style={styles.shelf}>
        {Object.entries(badgeNames).map(([slug, name]) => {
          const owned = earned.includes(slug);
          return (
            <Text key={slug} style={owned ? styles.owned : styles.locked}>
              {owned ? name : `${name} is still waiting`}
            </Text>
          );
        })}
      </View>
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  shelf: { gap: 8 },
  owned: {
    color: colors.deep,
    fontFamily: font.bold,
    fontSize: 22,
  },
  locked: {
    color: colors.sea,
    fontFamily: font.regular,
    fontSize: 18,
  },
});
