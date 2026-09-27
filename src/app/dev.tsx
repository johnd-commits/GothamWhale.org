import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Celebration } from '@/components/celebration';
import { Mascot } from '@/components/mascot';
import { OceanBackground } from '@/components/ocean-background';
import { SquishButton } from '@/components/squish-button';
import { WhaleCard } from '@/components/whale-card';
import { useSoundPreference } from '@/lib/sound-preference';
import { mascotStates, shouldAnimate, toggleSoundEnabled, type MascotState } from '@/theme/motion';
import { colors, font, space } from '@/theme/tokens';

export default function DevScreen() {
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [smallPlayId, setSmallPlayId] = useState(0);
  const [bigPlayId, setBigPlayId] = useState(0);
  const reduceMotion = useReducedMotion();
  const soundEnabled = useSoundPreference((state) => state.soundEnabled);
  const setSoundEnabled = useSoundPreference((state) => state.setSoundEnabled);

  return (
    <>
      <Stack.Screen options={{ title: 'Components', headerShown: true }} />
      <View style={styles.screen}>
        <OceanBackground />
        <ScrollView contentContainerStyle={styles.content}>
          <Text accessibilityRole="header" style={styles.title}>
            Component preview
          </Text>
          <Text style={styles.body}>
            {shouldAnimate(reduceMotion)
              ? 'Motion is on. Bubbles drift.'
              : 'Reduce motion is on. Bubbles stay still.'}
          </Text>
          <SquishButton
            label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
            sound={false}
            onPress={() => setSoundEnabled(toggleSoundEnabled(soundEnabled))}
          />
          <Text style={styles.body}>Mascot</Text>
          <Mascot state={mascotState} />
          <View style={styles.row}>
            {mascotStates.map((state) => (
              <SquishButton key={state} label={state} onPress={() => setMascotState(state)} />
            ))}
          </View>
          <WhaleCard name="Sample fluke" image={require('../../assets/images/sample-fluke.png')} />
          <SquishButton label="Small celebration" onPress={() => setSmallPlayId((id) => id + 1)} />
          <Celebration variant="small" playId={smallPlayId} />
          <SquishButton label="Big celebration" onPress={() => setBigPlayId((id) => id + 1)} />
          <Celebration variant="big" playId={bigPlayId} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.foam,
  },
  content: {
    padding: space.lg,
    gap: space.md,
  },
  title: {
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 32,
  },
  body: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 20,
    lineHeight: 28,
  },
  row: {
    gap: space.sm,
  },
});
