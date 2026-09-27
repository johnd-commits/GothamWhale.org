import { filterCatalog, isCatalogDay, starterCatalog, type CatalogQuery } from '../catalog';

const query: CatalogQuery = {
  text: '',
  kind: 'all',
  sex: 'all',
  tailShade: 'all',
  mark: 'all',
  place: 'all',
  dateMode: 'any',
  date: '',
};

test('catalog filters combine kind, shade, marks, place, and date', () => {
  expect(filterCatalog(starterCatalog, { ...query, kind: 'known-whale' })).toHaveLength(2);
  expect(filterCatalog(starterCatalog, { ...query, tailShade: 'mostly-white' }).map((row) => row.catalogId)).toEqual([
    'NYC0290',
  ]);
  expect(filterCatalog(starterCatalog, { ...query, mark: 'scars' })).toHaveLength(2);
  expect(filterCatalog(starterCatalog, { ...query, place: 'hudson', dateMode: 'before', date: '2026-01-01' })).toEqual([
    starterCatalog[2],
  ]);
  expect(filterCatalog(starterCatalog, { ...query, text: 'nyc0001' })).toHaveLength(1);
  expect(isCatalogDay('2026-09-20')).toBe(true);
  expect(isCatalogDay('2026-13-01')).toBe(false);
});
