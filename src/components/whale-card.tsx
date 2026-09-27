import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { colors, font, radius, space } from '@/theme/tokens';

type WhaleCardProps = {
  name: string;
  image: ImageSourcePropType;
};

export function WhaleCard({ name, image }: WhaleCardProps) {
  return (
    <View style={styles.card}>
      <Image source={image} accessibilityLabel={name} style={styles.photo} />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: radius.card,
    borderWidth: 4,
    borderColor: colors.sand,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 180,
    backgroundColor: colors.mist,
  },
  name: {
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 22,
    padding: space.md,
  },
});
