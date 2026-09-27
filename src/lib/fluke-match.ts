export type MatchDifficulty = {
  choices: 3 | 4;
};

export function difficultyForStreak(streak: number): MatchDifficulty {
  return { choices: streak >= 3 ? 4 : 3 };
}

export function scoreAnswer(correct: boolean, streak: number): { streak: number; correct: boolean } {
  if (!correct) {
    return { streak: 0, correct: false };
  }
  return { streak: streak + 1, correct: true };
}

export function highAccuracyFlag(attempts: number, correctCount: number): boolean {
  if (attempts < 10) {
    return false;
  }
  return correctCount / attempts >= 0.85;
}

export const flukeHint =
  'Look at the trailing edge, the black and white patches, and any scars. Stay curious. The whale is far away.';
