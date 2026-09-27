import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AdultGate } from '@/components/adult-gate';
import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { toDarwinCoreCsv, type PublicSightingRow } from '@/lib/darwin-core';
import { getSupabaseClient } from '@/lib/supabase';
import { colors, font } from '@/theme/tokens';

const sample: PublicSightingRow[] = [
  {
    occurrenceID: 'sample-rounded',
    basisOfRecord: 'HumanObservation',
    eventDate: '2026-09-20',
    scientificName: 'Megaptera novaeangliae',
    individualCount: 1,
    decimalLatitude: 40.58,
    decimalLongitude: -73.83,
  },
];

export default function AdminScreen() {
  return (
    <AdultGate>
      <ScienceReview />
    </AdultGate>
  );
}

function ScienceReview() {
  const [csv, setCsv] = useState('Choose Export to build a Darwin Core file from rounded rows.');

  async function exportCsv() {
    const client = getSupabaseClient();
    if (client === null) {
      setCsv(toDarwinCoreCsv(sample));
      return;
    }
    const { data } = await client
      .from('public_sightings')
      .select('occurrenceID, basisOfRecord, eventDate, scientificName, individualCount, decimalLatitude, decimalLongitude');
    const rows = (data ?? []) as PublicSightingRow[];
    setCsv(toDarwinCoreCsv(rows.length > 0 ? rows : sample));
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Science review' }} />
      <InfoScreen
        message="Researchers review whale photos here. This export uses the public rounded view."
        scroll
      >
        <SquishButton label="Export Darwin Core" onPress={() => void exportCsv()} />
        <Text selectable style={styles.csv}>
          {csv}
        </Text>
      </InfoScreen>
    </>
  );
}

const styles = StyleSheet.create({
  csv: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 16,
  },
});
