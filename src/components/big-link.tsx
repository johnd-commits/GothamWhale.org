import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

type BigLinkProps = {
  href: Href;
  label: string;
};

export function BigLink({ href, label }: BigLinkProps) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="button" style={styles.button}>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    minWidth: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#0E6B7A',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
