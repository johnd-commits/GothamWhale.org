export const kidTabs = [
  { href: '/', title: 'Home' },
  { href: '/my-whale', title: 'My Whale' },
  { href: '/play', title: 'Play' },
  { href: '/calm', title: 'Calm' },
  { href: '/badges', title: 'Badges' },
] as const;

export type KidTabHref = (typeof kidTabs)[number]['href'];

export const adultRoutes = [
  '/grown-ups',
  '/signup',
  '/reset-password',
  '/add-child',
  '/delete-child',
  '/observer',
  '/catalog',
] as const;

export const accountRoutes = ['/signup', '/reset-password'] as const;

export function isAccountRoute(href: string): boolean {
  return accountRoutes.some((route) => href === route);
}

export const webOnlyRoutes = ['/teacher', '/admin', '/map', '/donate'] as const;

export const hiddenRoutes = ['/dev'] as const;

export function isKidTab(href: string): boolean {
  return kidTabs.some((tab) => tab.href === href);
}
