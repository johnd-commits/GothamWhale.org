import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ChildProfileRecord } from '@/lib/child-records';
import { colors, font, radius, tapTarget } from '@/theme/tokens';

type ProfileSwitcherProps = {
  profiles: ChildProfileRecord[];
  activeId: string | null;
  onSelect: (childId: string) => void;
};

export function ProfileSwitcher({ profiles, activeId, onSelect }: ProfileSwitcherProps) {
  if (profiles.length === 0) {
    return <Text style={styles.empty}>No profiles yet. A grown-up can add one.</Text>;
  }

  return (
    <View style={styles.group}>
      <Text style={styles.label}>Who is looking today?</Text>
      {profiles.map((profile) => {
        const selected = profile.id === activeId;
        return (
          <Pressable
            key={profile.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.choice, selected ? styles.selected : null]}
            onPress={() => onSelect(profile.id)}
          >
            <Text style={styles.choiceLabel}>{profile.nickname}</Text>
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
  empty: {
    color: colors.ink,
    fontFamily: font.regular,
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
    fontFamily: font.bold,
    fontSize: 20,
  },
});
