export type CalmSession = {
  id: 'breathe' | 'song' | 'notice';
  title: string;
  minutes: 1 | 2 | 3;
  steps: string[];
};

export const calmSessions: CalmSession[] = [
  {
    id: 'breathe',
    title: 'Whale breath',
    minutes: 1,
    steps: [
      'Breathe in. The whale comes up.',
      'Breathe out. The whale dives.',
      'Do this slowly, five times.',
    ],
  },
  {
    id: 'song',
    title: 'Whale song',
    minutes: 2,
    steps: ['Sit still.', 'Listen to the soft tone.', 'Let the sound pass by.'],
  },
  {
    id: 'notice',
    title: 'Notice five things',
    minutes: 3,
    steps: [
      'Go with a grown-up.',
      'Name five things you can see.',
      'Stay at least 100 yards from any whale.',
    ],
  },
];

export type CalmRecord = {
  sessionId: CalmSession['id'];
  minutes: number;
};

export function calmRecord(session: CalmSession): CalmRecord {
  return { sessionId: session.id, minutes: session.minutes };
}
