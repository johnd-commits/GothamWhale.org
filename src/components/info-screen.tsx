import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { OceanBackground } from '@/components/ocean-background';
import { colors, font, space } from '@/theme/tokens';

type InfoScreenProps = {
  title?: string;
  message: string;
  children?: ReactNode;
  scroll?: boolean;
};

export function InfoScreen({ title, message, children, scroll = false }: InfoScreenProps) {
  const body = (
    <>
      {title ? (
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
      ) : null}
      <Text style={styles.message}>{message}</Text>
      {children ? <View style={styles.actions}>{children}</View> : null}
    </>
  );

  return (
    <View style={styles.fill}>
      <OceanBackground />
      {scroll ? (
        <ScrollView contentContainerStyle={styles.screen}>{body}</ScrollView>
      ) : (
        <View style={styles.screen}>{body}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: colors.foam,
  },
  screen: {
    flexGrow: 1,
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
