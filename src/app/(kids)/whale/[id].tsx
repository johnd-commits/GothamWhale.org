import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { InfoScreen } from '@/components/info-screen';
import { SightingMap } from '@/components/sighting-map';
import { WhaleCard } from '@/components/whale-card';
import { kidSightingMessage, roundTo2 } from '@/lib/harbor';
import { colors, font } from '@/theme/tokens';

const sampleImage = require('../../../../assets/images/sample-fluke.png');

const sampleSightings = [
  { id: 's1', latitude: 40.58, longitude: -73.83, seenOn: '2026-09-20' },
  { id: 's2', latitude: 40.7, longitude: -74.01, seenOn: '2026-09-12' },
];

export default function WhaleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const name = String(id);
  const newest = sampleSightings[0];

  return (
    <InfoScreen
      title={name}
      message={`Sample card. ${kidSightingMessage(name, newest.latitude, newest.longitude)} The spot is rounded. Seen ${newest.seenOn}.`}
      scroll
    >
      <WhaleCard image={sampleImage} name={name} />
      <SightingMap points={sampleSightings} />
      {sampleSightings.map((sighting) => (
        <Text key={sighting.id} style={styles.row}>
          {sighting.seenOn}: {roundTo2(sighting.latitude)}, {roundTo2(sighting.longitude)}
        </Text>
      ))}
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 18,
  },
});
