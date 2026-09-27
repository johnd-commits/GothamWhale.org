import AsyncStorage from '@react-native-async-storage/async-storage';

import { duplicateKey, type SightingDraft } from '@/lib/sighting-checks';

export type QueuedSighting = {
  occurrenceId: string;
  eventDate: string;
  latitude: number;
  longitude: number;
  platform: 'ferry' | 'shore' | 'boat';
  behavior: string;
  count: number;
  ok: boolean;
  reasons: string[];
};

const queueKey = 'tideline-sighting-queue';

export async function readSightingQueue(): Promise<QueuedSighting[]> {
  const raw = await AsyncStorage.getItem(queueKey);
  if (raw === null) {
    return [];
  }
  return JSON.parse(raw) as QueuedSighting[];
}

export async function enqueueSighting(entry: QueuedSighting): Promise<QueuedSighting[]> {
  const current = await readSightingQueue();
  const next = [...current, entry];
  await AsyncStorage.setItem(queueKey, JSON.stringify(next));
  return next;
}

export function existingSightingKeys(entries: QueuedSighting[], adultId: string): string[] {
  return entries.map((entry) =>
    duplicateKey({
      adultId,
      eventDate: entry.eventDate,
      latitude: entry.latitude,
      longitude: entry.longitude,
    }),
  );
}

export function draftFromQueue(
  adultId: string,
  entry: Pick<QueuedSighting, 'occurrenceId' | 'eventDate' | 'latitude' | 'longitude'>,
  photoTakenAt: string | null,
  existingKeys: string[],
): SightingDraft {
  return {
    occurrenceId: entry.occurrenceId,
    eventDate: entry.eventDate,
    photoTakenAt,
    latitude: entry.latitude,
    longitude: entry.longitude,
    adultId,
    existingKeys,
  };
}
