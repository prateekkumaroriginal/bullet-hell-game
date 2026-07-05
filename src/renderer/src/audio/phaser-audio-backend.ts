import Phaser from "phaser";
import { type AudioSettings } from "../../../shared/settings-types";
import {
  type AudioBackend,
  type AudioBackendPlayOptions
} from "./audio-controller";
import { type AudioSoundDefinition } from "./audio-catalog";

export class PhaserAudioBackend implements AudioBackend {
  constructor(private readonly soundManager: Phaser.Sound.BaseSoundManager) {}

  play(
    soundDefinition: AudioSoundDefinition,
    options: AudioBackendPlayOptions
  ): boolean {
    if (!this.soundManager.game.cache.audio.exists(soundDefinition.phaserKey)) {
      return false;
    }

    return this.soundManager.play(soundDefinition.phaserKey, {
      volume: options.volume,
      detune: options.detune
    });
  }

  getActiveCount(phaserKey: string): number {
    return this.soundManager
      .getAll(phaserKey)
      .filter((sound) => sound.isPlaying).length;
  }

  applySettings(settings: AudioSettings): void {
    this.soundManager.mute = settings.muted;
    this.soundManager.volume = settings.masterVolume;
  }
}
