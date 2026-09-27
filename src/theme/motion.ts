export const mascotStates = ['idle', 'happy', 'thinking', 'cheer'] as const;

export type MascotState = (typeof mascotStates)[number];

export type CelebrationVariant = 'small' | 'big';

export function shouldAnimate(reduceMotion: boolean | null | undefined): boolean {
  return reduceMotion !== true;
}

export function celebrationPixelSize(variant: CelebrationVariant): number {
  return variant === 'big' ? 280 : 140;
}

export function toggleSoundEnabled(enabled: boolean): boolean {
  return !enabled;
}
