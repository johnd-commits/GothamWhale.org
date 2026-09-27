import { earnedBadgeSlugs, topExplorer, type ChildProgress } from '../badges';
import { toDarwinCoreCsv } from '../darwin-core';
import { difficultyForStreak, highAccuracyFlag, scoreAnswer } from '../fluke-match';
import { kidSightingMessage, newSightingIds, plotRoundedPoint, roundTo2 } from '../harbor';
import { calmRecord, calmSessions } from '../ocean-minutes';
import { placeholderPaymentProvider } from '../payments';
import { completionRecord, isInsideQuest, questSafety } from '../quests';
import { autoCheck } from '../sighting-checks';
import { draftFromQueue, existingSightingKeys, type QueuedSighting } from '../sighting-queue';

const empty: ChildProgress = {
  follows: 0,
  flukeCorrect: 0,
  calmMinutes: 0,
  talesRead: 0,
  questsCompleted: 0,
  placeQuestsCompleted: 0,
  dexCards: 0,
  acknowledgedDistance: false,
  parentVerifiedSightings: 0,
  daysActive: 0,
};

test('public map points use two decimal places', () => {
  expect(roundTo2(40.7128)).toBe(40.71);
  const point = plotRoundedPoint(40.7128, -73.996, {
    minLat: 40.5,
    maxLat: 41,
    minLng: -74.2,
    maxLng: -73.7,
  });
  expect(point.x).toBeGreaterThan(0);
  expect(point.y).toBeGreaterThan(0);
});

test('a followed whale notice uses kid language', () => {
  expect(kidSightingMessage('Gotham', 40.58, -73.83)).toBe(
    'Your whale Gotham was spotted near the Rockaways!',
  );
  expect(newSightingIds(['a'], ['a', 'b'])).toEqual(['b']);
});

test('fluke match scoring raises difficulty and flags careful players', () => {
  expect(scoreAnswer(true, 2)).toEqual({ streak: 3, correct: true });
  expect(scoreAnswer(false, 4)).toEqual({ streak: 0, correct: false });
  expect(difficultyForStreak(2).choices).toBe(3);
  expect(difficultyForStreak(3).choices).toBe(4);
  expect(highAccuracyFlag(9, 9)).toBe(false);
  expect(highAccuracyFlag(10, 9)).toBe(true);
  expect(highAccuracyFlag(10, 8)).toBe(false);
});

test('calm time saves only the session and the minutes', () => {
  const record = calmRecord(calmSessions[0]);
  expect(record).toEqual({ sessionId: 'breathe', minutes: 1 });
  expect(record).not.toHaveProperty('latitude');
});

test('a child quest save has no coordinates', () => {
  const saved = completionRecord('harbor-path', new Date('2026-09-27T15:00:00.000Z'));
  expect(saved).toEqual({ questId: 'harbor-path', completedOn: '2026-09-27' });
  expect(Object.keys(saved).sort()).toEqual(['completedOn', 'questId']);
  expect(questSafety).toContain('100 yards');
  expect(
    isInsideQuest(
      { latitude: 40.7, longitude: -74.02 },
      { latitude: 40.7, longitude: -74.02, radiusMeters: 400 },
    ),
  ).toBe(true);
  expect(
    isInsideQuest(
      { latitude: 41.2, longitude: -73.5 },
      { latitude: 40.7, longitude: -74.02, radiusMeters: 400 },
    ),
  ).toBe(false);
});

test('every badge rule can be earned on its own', () => {
  expect(earnedBadgeSlugs(empty)).toEqual([]);
  expect(earnedBadgeSlugs({ ...empty, follows: 1 })).toEqual(['first-follow']);
  expect(earnedBadgeSlugs({ ...empty, follows: 5 })).toEqual(['first-follow', 'five-follows']);
  expect(earnedBadgeSlugs({ ...empty, flukeCorrect: 1 })).toEqual(['fluke-finder']);
  expect(earnedBadgeSlugs({ ...empty, calmMinutes: 1 })).toEqual(['calm-minute']);
  expect(earnedBadgeSlugs({ ...empty, talesRead: 1 })).toEqual(['tale-reader']);
  expect(earnedBadgeSlugs({ ...empty, questsCompleted: 1 })).toEqual(['quest-starter']);
  expect(earnedBadgeSlugs({ ...empty, placeQuestsCompleted: 1 })).toEqual([
    'harbor-helper',
    'grown-up-trip',
  ]);
  expect(earnedBadgeSlugs({ ...empty, dexCards: 1 })).toEqual(['dex-collector']);
  expect(earnedBadgeSlugs({ ...empty, acknowledgedDistance: true })).toEqual(['gentle-watcher']);
  expect(
    topExplorer({
      ...empty,
      follows: 5,
      flukeCorrect: 1,
      calmMinutes: 1,
      talesRead: 1,
      questsCompleted: 1,
      daysActive: 7,
    }),
  ).toBe(true);
});

test('automatic sighting checks reject a bad photo, a dry spot, a wild date, and a duplicate', () => {
  const now = new Date('2026-09-27T12:00:00.000Z');
  const good = {
    occurrenceId: 's1',
    eventDate: '2026-09-27T11:00:00.000Z',
    photoTakenAt: '2026-09-27T11:00:00.000Z',
    latitude: 40.7,
    longitude: -74.0,
    adultId: 'adult-1',
    existingKeys: [],
  };
  expect(autoCheck(good, now).ok).toBe(true);
  expect(autoCheck({ ...good, photoTakenAt: null }, now).reasons).toContain('photo-time');
  expect(autoCheck({ ...good, latitude: 41.5 }, now).reasons).toContain('water');
  expect(autoCheck({ ...good, eventDate: '1990-01-01T00:00:00.000Z' }, now).reasons).toContain(
    'date',
  );
  expect(
    autoCheck({ ...good, existingKeys: ['adult-1|2026-09-27|40.7|-74'] }, now).reasons,
  ).toContain('duplicate');
});

test('Darwin Core export keeps rounded coordinates', () => {
  const csv = toDarwinCoreCsv([
    {
      occurrenceID: 's1',
      basisOfRecord: 'HumanObservation',
      eventDate: '2026-09-27',
      scientificName: 'Megaptera novaeangliae',
      individualCount: 1,
      decimalLatitude: 40.71,
      decimalLongitude: -74.01,
    },
  ]);
  expect(csv.split('\n')[0]).toBe(
    'occurrenceID,basisOfRecord,eventDate,scientificName,individualCount,decimalLatitude,decimalLongitude',
  );
  expect(csv).toContain('40.71,-74.01');
});

test('a queued grown-up sighting does not name a child', () => {
  const entry: QueuedSighting = {
    occurrenceId: 'local-1',
    eventDate: '2026-09-27T11:00:00.000Z',
    latitude: 40.7,
    longitude: -74.02,
    platform: 'shore',
    behavior: 'traveling',
    count: 1,
    ok: true,
    reasons: [],
  };
  const draft = draftFromQueue('adult-1', entry, entry.eventDate, existingSightingKeys([entry], 'adult-1'));
  expect(JSON.stringify(draft)).not.toContain('child');
  expect(draft.existingKeys).toEqual(['adult-1|2026-09-27|40.7|-74.02']);
});

test('the payment placeholder pledges without charging', async () => {
  await expect(
    placeholderPaymentProvider.pledge({ adultId: 'adult-1', whaleId: 'w1', tierId: 'friend' }),
  ).resolves.toEqual({
    adultId: 'adult-1',
    whaleId: 'w1',
    tierId: 'friend',
    status: 'pledged',
  });
});
