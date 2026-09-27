export const tailShades = ['mostly-white', 'mixed', 'mostly-black'] as const;
export const flukeMarks = ['trailing-edge', 'pigment', 'scars'] as const;
export const harborPlaces = ['rockaways', 'harbor', 'hudson', 'bight'] as const;
export const catalogKinds = ['known-whale', 'sighting'] as const;

export type TailShade = (typeof tailShades)[number];
export type FlukeMark = (typeof flukeMarks)[number];
export type HarborPlace = (typeof harborPlaces)[number];
export type CatalogKind = (typeof catalogKinds)[number];

export type CatalogRecord = {
  id: string;
  catalogId: string;
  kind: CatalogKind;
  sex: 'female' | 'male' | 'unknown';
  tailShade: TailShade;
  marks: FlukeMark[];
  place: HarborPlace;
  seenOn: string;
  imageUri: string | null;
  note: string;
};

export type CatalogQuery = {
  text: string;
  kind: 'all' | CatalogKind;
  sex: 'all' | CatalogRecord['sex'];
  tailShade: 'all' | TailShade;
  mark: 'all' | FlukeMark;
  place: 'all' | HarborPlace;
  dateMode: 'any' | 'on' | 'before' | 'after';
  date: string;
};

export const emptyCatalogQuery: CatalogQuery = {
  text: '',
  kind: 'all',
  sex: 'all',
  tailShade: 'all',
  mark: 'all',
  place: 'all',
  dateMode: 'any',
  date: '',
};

const dayPattern = /^\d{4}-\d{2}-\d{2}$/;

export function isCatalogDay(value: string): boolean {
  if (!dayPattern.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function catalogIdOk(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 3 && trimmed.length <= 24 && /^[A-Za-z0-9-]+$/.test(trimmed);
}

export function filterCatalog(records: CatalogRecord[], query: CatalogQuery): CatalogRecord[] {
  const text = query.text.trim().toLowerCase();
  return records.filter((record) => {
    if (query.kind !== 'all' && record.kind !== query.kind) {
      return false;
    }
    if (query.sex !== 'all' && record.sex !== query.sex) {
      return false;
    }
    if (query.tailShade !== 'all' && record.tailShade !== query.tailShade) {
      return false;
    }
    if (query.mark !== 'all' && !record.marks.includes(query.mark)) {
      return false;
    }
    if (query.place !== 'all' && record.place !== query.place) {
      return false;
    }
    if (text.length > 0) {
      const haystack = `${record.catalogId} ${record.note}`.toLowerCase();
      if (!haystack.includes(text)) {
        return false;
      }
    }
    if (query.dateMode !== 'any' && isCatalogDay(query.date)) {
      if (query.dateMode === 'on' && record.seenOn !== query.date) {
        return false;
      }
      if (query.dateMode === 'before' && record.seenOn >= query.date) {
        return false;
      }
      if (query.dateMode === 'after' && record.seenOn <= query.date) {
        return false;
      }
    }
    return true;
  });
}

export const starterCatalog: CatalogRecord[] = [
  {
    id: 'sample-ny-001',
    catalogId: 'NYC0001',
    kind: 'known-whale',
    sex: 'unknown',
    tailShade: 'mostly-black',
    marks: ['trailing-edge', 'pigment'],
    place: 'rockaways',
    seenOn: '2026-09-20',
    imageUri: null,
    note: 'Sample card for practice',
  },
  {
    id: 'sample-ny-144',
    catalogId: 'NYC0144',
    kind: 'sighting',
    sex: 'female',
    tailShade: 'mixed',
    marks: ['scars'],
    place: 'harbor',
    seenOn: '2026-08-02',
    imageUri: null,
    note: 'Sample sighting',
  },
  {
    id: 'sample-ny-290',
    catalogId: 'NYC0290',
    kind: 'known-whale',
    sex: 'male',
    tailShade: 'mostly-white',
    marks: ['trailing-edge', 'scars'],
    place: 'hudson',
    seenOn: '2025-10-11',
    imageUri: null,
    note: 'Sample card for practice',
  },
];
