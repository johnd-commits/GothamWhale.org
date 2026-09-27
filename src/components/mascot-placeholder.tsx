import { StyleSheet, Text, View } from 'react-native';

import { colors, font, space } from '@/theme/tokens';
import type { MascotState } from '@/theme/motion';

type MascotPlaceholderProps = {
  state: MascotState;
};

export function MascotPlaceholder({ state }: MascotPlaceholderProps) {
  return (
    <View accessibilityRole="image" accessibilityLabel={`Mascot is ${state}`} style={styles.wrap}>
      <View style={styles.tail} />
      <View style={styles.body}>
        <View style={styles.eye} />
        {state === 'thinking' ? <Text style={styles.mark}>...</Text> : null}
        {state === 'cheer' ? <Text style={styles.mark}>!</Text> : null}
      </View>
      <Text style={styles.caption}>{state}</Text>
    </View>
  );
}

export function Mascot({ state }: MascotPlaceholderProps) {
  return <MascotPlaceholder state={state} />;
}

const styles = StyleSheet.create({
  wrap: {
    width: 180,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: 120,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.sea,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: space.md,
  },
  tail: {
    position: 'absolute',
    left: 18,
    width: 36,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.deep,
    transform: [{ rotate: '-30deg' }],
  },
  eye: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.white,
  },
  mark: {
    position: 'absolute',
    top: -28,
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 28,
  },
  caption: {
    marginTop: space.xs,
    color: colors.ink,
    fontFamily: font.semibold,
    fontSize: 18,
  },
});
