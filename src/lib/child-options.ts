export const nicknames = [
  'Splash',
  'Bubbles',
  'Fin',
  'Kelp',
  'Harbor',
  'Tide',
  'Pearl',
  'Coral',
  'Drift',
  'Nimbus',
  'Sunny',
  'Pebble',
  'Mariner',
  'Comet',
  'Echo',
] as const;

export const avatars = [
  'humpback',
  'fluke',
  'ferry',
  'lighthouse',
  'moon',
  'shell',
  'star',
  'kelp',
] as const;

export const ageBands = ['7-8', '9-10', '11-12', '13-14'] as const;

export type Nickname = (typeof nicknames)[number];
export type Avatar = (typeof avatars)[number];
export type AgeBand = (typeof ageBands)[number];

export function isNickname(value: string): value is Nickname {
  return nicknames.some((nickname) => nickname === value);
}

export function isAvatar(value: string): value is Avatar {
  return avatars.some((avatar) => avatar === value);
}

export function isAgeBand(value: string): value is AgeBand {
  return ageBands.some((band) => band === value);
}
