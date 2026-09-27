import { filterNamedWhales, filterWhaleSources, namedWhales, whaleSources } from '../whale-sources';

test('named whale search finds Salt and keeps the right whale separate', () => {
  expect(filterNamedWhales(namedWhales, { text: 'salt', species: 'all' }).map((whale) => whale.name)).toEqual([
    'Salt',
    'Pepper',
  ]);
  expect(filterNamedWhales(namedWhales, { text: '', species: 'right-whale' }).map((whale) => whale.name)).toEqual([
    'Wolf',
  ]);
  expect(namedWhales.find((whale) => whale.name === 'Sword')?.catalogId).toBe('NAHWC na00124');
  expect(filterWhaleSources(whaleSources, { text: 'callosities', species: 'all' })).toHaveLength(1);
  expect(filterWhaleSources(whaleSources, { text: '', species: 'humpback' }).length).toBeGreaterThan(5);
});
