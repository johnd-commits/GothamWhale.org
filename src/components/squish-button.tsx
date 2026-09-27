import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { playCue } from '@/lib/play-cue';
import { shouldAnimate } from '@/theme/motion';
import { colors, font, radius, tapTarget } from '@/theme/tokens';

type SquishButtonProps = PressableProps & {
  label: string;
  sound?: boolean;
};

export function SquishButton({
  label,
  sound = true,
  onPress,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: SquishButtonProps) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...rest}
        accessibilityRole="button"
        style={(state) => [styles.button, typeof style === 'function' ? style(state) : style]}
        onPressIn={(event) => {
          if (shouldAnimate(reduceMotion)) {
            scale.set(withTiming(0.96, { duration: 80 }));
          }
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.set(withTiming(1, { duration: 120 }));
          onPressOut?.(event);
        }}
        onPress={(event) => {
          if (sound) {
            playCue('tap');
          }
          onPress?.(event);
        }}
      >
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: tapTarget,
    minWidth: tapTarget,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: radius.button,
    backgroundColor: colors.sea,
  },
  label: {
    color: colors.white,
    fontFamily: font.semibold,
    fontSize: 18,
    textAlign: 'center',
  },
});
