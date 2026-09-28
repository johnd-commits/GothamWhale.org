import { adultRoutes, hiddenRoutes, isAccountRoute, isKidTab, kidTabs, webOnlyRoutes } from '../routes';

test('kids have five tabs and no adult or web routes', () => {
  expect(kidTabs.map((tab) => tab.title)).toEqual([
    'Home',
    'My Whale',
    'Play',
    'Calm',
    'Badges',
  ]);

  for (const href of [...adultRoutes, ...webOnlyRoutes, ...hiddenRoutes]) {
    expect(isKidTab(href)).toBe(false);
  }
  expect(isAccountRoute('/signup')).toBe(true);
  expect(isAccountRoute('/reset-password')).toBe(true);
  expect(isAccountRoute('/grown-ups')).toBe(false);
});
