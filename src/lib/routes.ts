export const kidTabs = [
  { href: '/', title: 'Home' },
  { href: '/my-whale', title: 'My Whale' },
  { href: '/play', title: 'Play' },
  { href: '/calm', title: 'Calm' },
  { href: '/badges', title: 'Badges' },
] as const;

export type KidTabHref = (typeof kidTabs)[number]['href'];

export const adultRoutes = ['/grown-ups', '/signup', '/add-child', '/delete-child', '/observer'] as const;

export const webOnlyRoutes = ['/teacher', '/admin', '/map', '/donate'] as const;

export const hiddenRoutes = ['/dev'] as const;

export function isKidTab(href: string): boolean {
  return kidTabs.some((tab) => tab.href === href);
}
