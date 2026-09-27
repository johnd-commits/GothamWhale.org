export type SightingDraft = {
  occurrenceId: string;
  eventDate: string;
  photoTakenAt: string | null;
  latitude: number | null;
  longitude: number | null;
  adultId: string;
  existingKeys: string[];
};

const harbor = { minLat: 40.4, maxLat: 40.9, minLng: -74.3, maxLng: -73.6 };

export function autoCheck(draft: SightingDraft, now = new Date()): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const event = new Date(draft.eventDate);
  const newest = now.getTime() + 60 * 60 * 1000;
  const oldest = now.getTime() - 1000 * 60 * 60 * 24 * 365 * 2;
  if (Number.isNaN(event.getTime()) || event.getTime() > newest || event.getTime() < oldest) {
    reasons.push('date');
  }
  if (!draft.photoTakenAt) {
    reasons.push('photo-time');
  }
  if (
    draft.latitude === null ||
    draft.longitude === null ||
    draft.latitude < harbor.minLat ||
    draft.latitude > harbor.maxLat ||
    draft.longitude < harbor.minLng ||
    draft.longitude > harbor.maxLng
  ) {
    reasons.push('water');
  }
  const key = `${draft.adultId}|${draft.eventDate.slice(0, 10)}|${draft.latitude}|${draft.longitude}`;
  if (draft.existingKeys.includes(key)) {
    reasons.push('duplicate');
  }
  return { ok: reasons.length === 0, reasons };
}

export function duplicateKey(draft: Pick<SightingDraft, 'adultId' | 'eventDate' | 'latitude' | 'longitude'>): string {
  return `${draft.adultId}|${draft.eventDate.slice(0, 10)}|${draft.latitude}|${draft.longitude}`;
}
