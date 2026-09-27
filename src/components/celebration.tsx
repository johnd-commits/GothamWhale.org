import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { playCue } from '@/lib/play-cue';
import { celebrationPixelSize, shouldAnimate, type CelebrationVariant } from '@/theme/motion';
import { colors, font } from '@/theme/tokens';

type CelebrationProps = {
  variant: CelebrationVariant;
  playId: number;
};

export function Celebration({ variant, playId }: CelebrationProps) {
  const reduceMotion = useReducedMotion();
  const size = celebrationPixelSize(variant);
  const showMotion = shouldAnimate(reduceMotion) && playId > 0;

  useEffect(() => {
    if (playId === 0) {
      return;
    }
    playCue('cheer');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => undefined,
    );
  }, [playId]);

  if (playId === 0) {
    return null;
  }

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={variant === 'big' ? 'Big celebration' : 'Small celebration'}
      style={[styles.wrap, { width: size, height: size }]}
    >
      {showMotion ? (
        <LottieView
          key={playId}
          source={require('../../assets/lottie/burst.json')}
          autoPlay
          loop={false}
          style={styles.burst}
        />
      ) : (
        <Text style={styles.still}>Yay</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  burst: {
    width: '100%',
    height: '100%',
  },
  still: {
    color: colors.amber,
    fontFamily: font.bold,
    fontSize: 32,
  },
});
