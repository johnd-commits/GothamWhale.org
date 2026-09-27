import { adultRoutes, isKidTab, kidTabs, webOnlyRoutes } from '../routes';

test('kids have five tabs and no adult or web routes', () => {
  expect(kidTabs.map((tab) => tab.title)).toEqual([
    'Home',
    'My Whale',
    'Play',
    'Calm',
    'Badges',
  ]);

  for (const href of [...adultRoutes, ...webOnlyRoutes]) {
    expect(isKidTab(href)).toBe(false);
  }
});
