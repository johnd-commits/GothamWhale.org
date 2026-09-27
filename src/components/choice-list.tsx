import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, font, radius, tapTarget } from '@/theme/tokens';

type ChoiceListProps = {
  label: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string) => void;
};

export function ChoiceList({ label, options, value, onChange }: ChoiceListProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.choice, selected ? styles.selected : null]}
            onPress={() => onChange(option)}
          >
            <Text style={styles.choiceLabel}>{selected ? `${option} picked` : option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 8,
  },
  label: {
    color: colors.ink,
    fontFamily: font.semibold,
    fontSize: 18,
  },
  choice: {
    minHeight: tapTarget,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: radius.button,
    borderWidth: 3,
    borderColor: colors.mist,
    backgroundColor: colors.white,
  },
  selected: {
    borderColor: colors.deep,
    backgroundColor: colors.sand,
  },
  choiceLabel: {
    color: colors.ink,
    fontFamily: font.semibold,
    fontSize: 18,
  },
});
