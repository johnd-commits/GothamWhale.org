import { Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { AdultGate } from '@/components/adult-gate';
import { InfoScreen } from '@/components/info-screen';
import { earnedBadgeSlugs } from '@/lib/badges';
import { usePlayProgress } from '@/lib/play-progress';
import { colors, font } from '@/theme/tokens';

export default function TeacherScreen() {
  return (
    <AdultGate>
      <TeacherDesk />
    </AdultGate>
  );
}

function TeacherDesk() {
  const progress = usePlayProgress();
  const badges = earnedBadgeSlugs(progress);

  return (
    <>
      <Stack.Screen options={{ title: 'Teacher desk' }} />
      <InfoScreen
        message="Class totals appear after a teacher is signed in. This desk shows progress saved on this device."
        scroll
      >
        <Text style={styles.line}>Whales followed: {progress.follows}</Text>
        <Text style={styles.line}>Fluke matches: {progress.flukeCorrect}</Text>
        <Text style={styles.line}>Quiet minutes: {progress.calmMinutes}</Text>
        <Text style={styles.line}>Tales finished: {progress.talesRead}</Text>
        <Text style={styles.line}>Quests finished: {progress.questsCompleted}</Text>
        <Text style={styles.line}>Badges: {badges.length === 0 ? 'none yet' : badges.join(', ')}</Text>
        <Text style={styles.line}>
          Careful fluke flag: {progress.carefulMatcher ? 'yes' : 'not yet'}
        </Text>
      </InfoScreen>
    </>
  );
}

const styles = StyleSheet.create({
  line: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 20,
  },
});
