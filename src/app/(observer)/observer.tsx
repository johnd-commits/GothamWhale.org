import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AdultGate } from '@/components/adult-gate';
import { ChoiceList } from '@/components/choice-list';
import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { usePlayProgress } from '@/lib/play-progress';
import { autoCheck } from '@/lib/sighting-checks';
import {
  draftFromQueue,
  enqueueSighting,
  existingSightingKeys,
  readSightingQueue,
  type QueuedSighting,
} from '@/lib/sighting-queue';
import { colors, font } from '@/theme/tokens';

const platforms = ['ferry', 'shore', 'boat'] as const;
const behaviors = ['feeding', 'traveling', 'resting'] as const;
const counts = ['1', '2', '3', '4'] as const;
const spots = [
  { label: 'Rockaways', latitude: 40.58, longitude: -73.83 },
  { label: 'Harbor', latitude: 40.7, longitude: -74.02 },
  { label: 'Inland', latitude: 41.5, longitude: -73.9 },
] as const;

export default function ObserverScreen() {
  return (
    <AdultGate>
      <ObserverForm />
    </AdultGate>
  );
}

function ObserverForm() {
  const addParentSighting = usePlayProgress((state) => state.addParentSighting);
  const acknowledgeDistance = usePlayProgress((state) => state.acknowledgeDistance);
  const [platform, setPlatform] = useState<string | null>(null);
  const [behavior, setBehavior] = useState<string | null>(null);
  const [count, setCount] = useState<string | null>(null);
  const [spot, setSpot] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState(
    'Stay at least 100 yards from whales. A precise spot is saved only after you allow it.',
  );

  async function checkReport() {
    if (!consent || platform === null || behavior === null || count === null || spot === null) {
      setNote('Choose a platform, a behavior, a count, a spot, and allow the precise location.');
      return;
    }
    const chosen = spots.find((item) => item.label === spot);
    if (chosen === undefined) {
      return;
    }
    const queue = await readSightingQueue();
    const eventDate = new Date().toISOString();
    const draft = draftFromQueue(
      'this-grown-up',
      {
        occurrenceId: `local-${queue.length + 1}`,
        eventDate,
        latitude: chosen.latitude,
        longitude: chosen.longitude,
      },
      photo === 'Photo has a time' ? eventDate : null,
      existingSightingKeys(queue, 'this-grown-up'),
    );
    const result = autoCheck(draft);
    const entry: QueuedSighting = {
      occurrenceId: draft.occurrenceId,
      eventDate,
      latitude: chosen.latitude,
      longitude: chosen.longitude,
      platform: platform as QueuedSighting['platform'],
      behavior,
      count: Number(count),
      ok: result.ok,
      reasons: result.reasons,
    };
    await enqueueSighting(entry);
    if (result.ok) {
      addParentSighting();
      setNote('Checked and waiting on this device. No points are given for getting close.');
      return;
    }
    setNote(`Held for review: ${result.reasons.join(', ')}.`);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Observer' }} />
      <InfoScreen message={note} scroll>
        <Text style={styles.rule}>Go with a grown-up. Stay at least 100 yards from whales.</Text>
        <ChoiceList label="Platform" options={platforms} value={platform} onChange={setPlatform} />
        <ChoiceList label="Behavior" options={behaviors} value={behavior} onChange={setBehavior} />
        <ChoiceList label="Whales seen" options={counts} value={count} onChange={setCount} />
        <ChoiceList
          label="Spot"
          options={spots.map((item) => item.label)}
          value={spot}
          onChange={setSpot}
        />
        <ChoiceList
          label="Photo"
          options={['Photo has a time', 'No photo time']}
          value={photo}
          onChange={setPhoto}
        />
        <SquishButton
          label={consent ? 'Precise spot allowed' : 'Allow a precise spot'}
          sound={false}
          onPress={() => setConsent((current) => !current)}
        />
        <SquishButton label="Check this report" onPress={() => void checkReport()} />
        <SquishButton
          label="We stayed 100 yards away"
          onPress={() => {
            acknowledgeDistance();
            setNote('Distance noted for the child badge shelf.');
          }}
        />
      </InfoScreen>
    </>
  );
}

const styles = StyleSheet.create({
  rule: {
    color: colors.ink,
    fontFamily: font.semibold,
    fontSize: 18,
  },
});
