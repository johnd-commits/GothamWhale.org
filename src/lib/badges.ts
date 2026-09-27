export type ChildProgress = {
  follows: number;
  flukeCorrect: number;
  calmMinutes: number;
  talesRead: number;
  questsCompleted: number;
  placeQuestsCompleted: number;
  dexCards: number;
  acknowledgedDistance: boolean;
  parentVerifiedSightings: number;
  daysActive: number;
};

const rules: { slug: string; test: (progress: ChildProgress) => boolean }[] = [
  { slug: 'first-follow', test: (progress) => progress.follows >= 1 },
  { slug: 'five-follows', test: (progress) => progress.follows >= 5 },
  { slug: 'fluke-finder', test: (progress) => progress.flukeCorrect >= 1 },
  { slug: 'calm-minute', test: (progress) => progress.calmMinutes >= 1 },
  { slug: 'tale-reader', test: (progress) => progress.talesRead >= 1 },
  { slug: 'quest-starter', test: (progress) => progress.questsCompleted >= 1 },
  { slug: 'harbor-helper', test: (progress) => progress.placeQuestsCompleted >= 1 },
  { slug: 'grown-up-trip', test: (progress) => progress.placeQuestsCompleted >= 1 },
  { slug: 'dex-collector', test: (progress) => progress.dexCards >= 1 },
  { slug: 'gentle-watcher', test: (progress) => progress.acknowledgedDistance },
];

export function earnedBadgeSlugs(progress: ChildProgress): string[] {
  return rules.filter((rule) => rule.test(progress)).map((rule) => rule.slug);
}

export function topExplorer(progress: ChildProgress): boolean {
  return progress.daysActive >= 7 && earnedBadgeSlugs(progress).length >= 5;
}
