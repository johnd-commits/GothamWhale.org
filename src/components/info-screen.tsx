import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OceanBackground } from '@/components/ocean-background';
import { colors, font, space } from '@/theme/tokens';

type InfoScreenProps = {
  title?: string;
  message: string;
  children?: ReactNode;
};

export function InfoScreen({ title, message, children }: InfoScreenProps) {
  return (
    <View style={styles.screen}>
      <OceanBackground />
      {title ? (
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
      ) : null}
      <Text style={styles.message}>{message}</Text>
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.foam,
    padding: space.lg,
    gap: space.md,
  },
  title: {
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 32,
  },
  message: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 20,
    lineHeight: 28,
  },
  actions: {
    gap: space.sm,
  },
});
