import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { shouldAnimate } from '@/theme/motion';
import { colors } from '@/theme/tokens';

const bubbles = [
  { left: '8%', size: 18, delay: 0 },
  { left: '22%', size: 12, delay: 400 },
  { left: '46%', size: 22, delay: 200 },
  { left: '68%', size: 14, delay: 700 },
  { left: '84%', size: 16, delay: 300 },
] as const;

function Bubble({
  left,
  size,
  delay,
  animate,
}: {
  left: string;
  size: number;
  delay: number;
  animate: boolean;
}) {
  const rise = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: rise.value }],
  }));

  useEffect(() => {
    if (!animate) {
      rise.set(0);
      return;
    }
    const timer = setTimeout(() => {
      rise.set(withRepeat(withTiming(-220, { duration: 7000 }), -1, false));
    }, delay);
    return () => clearTimeout(timer);
  }, [animate, delay, rise]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        style,
        { left: left as `${number}%`, width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

export function OceanBackground() {
  const reduceMotion = useReducedMotion();
  const animate = shouldAnimate(reduceMotion);
  const wave = useSharedValue(0);
  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: wave.value }],
  }));

  useEffect(() => {
    if (!animate) {
      wave.set(0);
      return;
    }
    wave.set(withRepeat(withTiming(-40, { duration: 4000 }), -1, true));
  }, [animate, wave]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} accessibilityElementsHidden>
      {bubbles.map((bubble) => (
        <Bubble key={bubble.left} {...bubble} animate={animate} />
      ))}
      <Animated.View style={[styles.wave, waveStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: colors.sky,
    opacity: 0.45,
  },
  wave: {
    position: 'absolute',
    left: -20,
    right: -20,
    bottom: -24,
    height: 72,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    backgroundColor: colors.mist,
  },
});
