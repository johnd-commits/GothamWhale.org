import {
  celebrationPixelSize,
  mascotStates,
  shouldAnimate,
  toggleSoundEnabled,
} from '../motion';

test('motion stops when reduce motion is on', () => {
  expect(shouldAnimate(false)).toBe(true);
  expect(shouldAnimate(null)).toBe(true);
  expect(shouldAnimate(true)).toBe(false);
});

test('celebration sizes stay distinct for small and big', () => {
  expect(celebrationPixelSize('small')).toBe(140);
  expect(celebrationPixelSize('big')).toBe(280);
});

test('sound toggle flips a saved boolean', () => {
  expect(toggleSoundEnabled(true)).toBe(false);
  expect(toggleSoundEnabled(false)).toBe(true);
});

test('mascot has the four illustrator states', () => {
  expect(mascotStates).toEqual(['idle', 'happy', 'thinking', 'cheer']);
});
