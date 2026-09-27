import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type InfoScreenProps = {
  title?: string;
  message: string;
  children?: ReactNode;
};

export function InfoScreen({ title, message, children }: InfoScreenProps) {
  return (
    <View style={styles.screen}>
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
    backgroundColor: '#F4FBFC',
    padding: 24,
    gap: 16,
  },
  title: {
    color: '#082F3A',
    fontSize: 32,
    fontWeight: '700',
  },
  message: {
    color: '#082F3A',
    fontSize: 20,
    lineHeight: 28,
  },
  actions: {
    gap: 12,
  },
});
