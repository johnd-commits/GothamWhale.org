import { StyleSheet, View } from 'react-native';

import { plotRoundedPoint } from '@/lib/harbor';
import { colors, radius } from '@/theme/tokens';

const bounds = { minLat: 40.5, maxLat: 40.9, minLng: -74.2, maxLng: -73.7 };

type SightingMapProps = {
  points: { id: string; latitude: number; longitude: number }[];
};

export function SightingMap({ points }: SightingMapProps) {
  return (
    <View
      accessibilityLabel="Simple map of rounded sightings"
      style={styles.map}
    >
      {points.map((point) => {
        const spot = plotRoundedPoint(point.latitude, point.longitude, bounds);
        return (
          <View
            key={point.id}
            style={[
              styles.dot,
              { left: `${Math.min(0.92, Math.max(0.04, spot.x)) * 100}%`, top: `${Math.min(0.86, Math.max(0.06, spot.y)) * 100}%` },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 180,
    borderRadius: radius.card,
    backgroundColor: colors.sky,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.deep,
  },
});
