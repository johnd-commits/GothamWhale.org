export type QuestCompletionRecord = {
  questId: string;
  completedOn: string;
};

export function completionRecord(questId: string, day: Date): QuestCompletionRecord {
  return {
    questId,
    completedOn: day.toISOString().slice(0, 10),
  };
}

export function distanceMeters(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): number {
  const earth = 6371000;
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earth * Math.asin(Math.sqrt(a));
}

export function isInsideQuest(
  here: { latitude: number; longitude: number },
  quest: { latitude: number; longitude: number; radiusMeters: number },
): boolean {
  return (
    distanceMeters(here.latitude, here.longitude, quest.latitude, quest.longitude) <=
    quest.radiusMeters
  );
}

export const questSafety =
  'Go with a grown-up. Stay at least 100 yards from whales.';
