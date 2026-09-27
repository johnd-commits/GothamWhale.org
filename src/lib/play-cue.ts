import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

import { useSoundPreference } from '@/lib/sound-preference';

const sources = {
  tap: require('../../assets/sounds/tap.wav'),
  cheer: require('../../assets/sounds/cheer.wav'),
} as const;

export type CueName = keyof typeof sources;

const players = new Map<CueName, AudioPlayer>();

export function playCue(name: CueName): void {
  if (!useSoundPreference.getState().soundEnabled) {
    return;
  }

  try {
    let player = players.get(name);
    if (!player) {
      player = createAudioPlayer(sources[name]);
      players.set(name, player);
    }
    void player.seekTo(0);
    player.play();
  } catch {
    // A missing player on web should not block the tap.
  }
}
