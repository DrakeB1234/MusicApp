import { Howl } from 'howler';

const SFX_MAP: Record<string, [number, number]> = {
  clickDown: [0, 500],
  clickUp: [500, 500],
  wrong: [1000, 500],
  correct: [1500, 500],
};

class SfxAudioService {
  isReady = $state(false);

  private volume = 1;
  private sound: Howl | null = null;

  init() {
    if (this.sound) return;

    this.sound = new Howl({
      src: ['/audio/SFXSprite.mp3'],
      sprite: SFX_MAP,
      volume: this.volume,
      onload: () => {
        this.isReady = true;
      }
    });
  }

  play(id: "clickDown" | "clickUp" | "wrong" | "correct") {
    if (!this.sound) return;

    this.sound.play(id);
  }

  setVolume(val: number) {
    this.volume = val;
    if (this.sound) {
      this.sound.volume(val);
    }
  }
}

export const sfxAudioService = new SfxAudioService();