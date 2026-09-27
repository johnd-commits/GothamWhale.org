import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { calmRecord, calmSessions } from '@/lib/ocean-minutes';
import { usePlayProgress } from '@/lib/play-progress';
import { colors, font } from '@/theme/tokens';

export default function CalmScreen() {
  const addCalm = usePlayProgress((state) => state.addCalm);
  const [note, setNote] = useState('Pick a quiet minute. You can stop whenever you want.');

  return (
    <InfoScreen title="Calm" message={note} scroll>
      {calmSessions.map((session) => (
        <View key={session.id} style={styles.block}>
          <Text style={styles.title}>{session.title}</Text>
          <Text style={styles.steps}>{session.steps.join(' ')}</Text>
          <SquishButton
            label={`I finished ${session.minutes} quiet ${session.minutes === 1 ? 'minute' : 'minutes'}`}
            onPress={() => {
              const saved = calmRecord(session);
              addCalm(saved.minutes);
              setNote(`${session.title} is done. Only the minutes were saved.`);
            }}
          />
        </View>
      ))}
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 16 },
  title: {
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 24,
  },
  steps: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 18,
  },
});
