import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { InfoScreen } from '@/components/info-screen';
import { SightingMap } from '@/components/sighting-map';
import { roundTo2 } from '@/lib/harbor';
import { getSupabaseClient } from '@/lib/supabase';
import { colors, font } from '@/theme/tokens';

type MapRow = {
  id: string;
  latitude: number;
  longitude: number;
  seenOn: string;
};

const cacheKey = 'tideline-public-map';

const sampleRows: MapRow[] = [
  { id: 'sample-1', latitude: 40.58, longitude: -73.83, seenOn: '2026-09-20' },
  { id: 'sample-2', latitude: 40.7, longitude: -74.01, seenOn: '2026-09-12' },
];

export default function MapScreen() {
  const [rows, setRows] = useState<MapRow[]>(sampleRows);

  useEffect(() => {
    let ignore = false;
    void AsyncStorage.getItem(cacheKey).then((raw) => {
      if (ignore || raw === null) {
        return;
      }
      const saved = JSON.parse(raw) as MapRow[];
      if (saved.length > 0) {
        setRows(saved);
      }
    });
    const client = getSupabaseClient();
    if (client === null) {
      return () => {
        ignore = true;
      };
    }
    void client
      .from('public_sightings')
      .select('id, decimalLatitude, decimalLongitude, eventDate')
      .then(({ data }) => {
        if (ignore || data === null || data.length === 0) {
          return;
        }
        const next = (
          data as {
            id: string;
            decimalLatitude: number;
            decimalLongitude: number;
            eventDate: string;
          }[]
        ).map((row) => ({
          id: row.id,
          latitude: roundTo2(Number(row.decimalLatitude)),
          longitude: roundTo2(Number(row.decimalLongitude)),
          seenOn: String(row.eventDate).slice(0, 10),
        }));
        setRows(next);
        void AsyncStorage.setItem(cacheKey, JSON.stringify(next));
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Whale map' }} />
      <InfoScreen
        message="These spots are rounded. Research-grade sightings are the only ones on the public map."
        scroll
      >
        <SightingMap points={rows} />
        {rows.map((row) => (
          <Text key={row.id} style={styles.row}>
            {row.seenOn}: {row.latitude}, {row.longitude}
          </Text>
        ))}
      </InfoScreen>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 18,
  },
});
