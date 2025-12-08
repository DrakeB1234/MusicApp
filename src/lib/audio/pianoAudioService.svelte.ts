import { getNaturalNoteIndex, noteToAbsoluteSemitone, type Note } from '$lib/helpers/notehelpers';
import { Howl, Howler } from 'howler';

const SPRITE_MAP_ANCHOR_POINTS = [
  { name: 'C1', val: 12 },
  { name: 'G1', val: 19 },
  { name: 'C2', val: 24 },
  { name: 'G2', val: 31 },
  { name: 'C3', val: 36 },
  { name: 'G3', val: 43 },
  { name: 'C4', val: 48 },
  { name: 'G4', val: 55 },
  { name: 'C5', val: 60 },
  { name: 'G5', val: 67 },
  { name: 'C6', val: 72 },
  { name: 'G6', val: 79 },
  { name: 'C7', val: 84 },
  { name: 'G7', val: 91 },
  { name: 'C8', val: 96 }
];

const SPRITE_MAP: Record<string, [number, number]> = {
  // [Start Time (ms), Duration (ms)]
  C1: [0, 3000],
  G1: [3000, 3000],
  C2: [6000, 3000],
  G2: [9000, 3000],
  C3: [12000, 3000],
  G3: [15000, 3000],
  C4: [18000, 3000],
  G4: [21000, 3000],
  C5: [24000, 3000],
  G5: [27000, 3000],
  C6: [30000, 3000],
  G6: [33000, 3000],
  C7: [36000, 3000],
  G7: [39000, 3000],
  C8: [42000, 3000],
};

class PianoAudioService {
  isReady = $state(false);
  isLoading = $state(false);
  error = $state<string | null>(null);
  isMuted = $state(false);

  private sound: Howl | null = null;

  async init() {
    if (this.sound || this.isLoading) return;

    this.isLoading = true;

    return new Promise<void>((resolve, reject) => {
      this.sound = new Howl({
        src: ['/audio/PianoSprite.mp3'],
        sprite: SPRITE_MAP,
        onload: () => {
          this.isReady = true;
          this.isLoading = false;
          resolve();
        },
        onloaderror: (id, err) => {
          this.isLoading = false;
          this.error = "Failed to load audio.";
          console.error("Audio Load Error", err);
          reject(err);
        }
      });
    });
  }

  /**
   * Determines whether to use the C sample or G sample 
   * based on which is closer to minimize stretching.
   */
  private calculateStrategy(note: Note) {
    const targetSemitone = noteToAbsoluteSemitone(note);

    const bestAnchor = SPRITE_MAP_ANCHOR_POINTS.reduce((prev, curr) => {
      return (Math.abs(curr.val - targetSemitone) < Math.abs(prev.val - targetSemitone)
        ? curr
        : prev);
    });

    const semitoneShift = targetSemitone - bestAnchor.val;

    return {
      sampleName: bestAnchor.name,
      semitoneShift
    };
  }
  playNote(note: Note) {
    if (!this.isReady || !this.sound) {
      console.warn("Audio was requested, but pianoAudioService was never intialized.");
      return;
    };

    const strategy = this.calculateStrategy(note);
    if (!strategy) return;

    const soundId = this.sound.play(strategy.sampleName);

    const rate = Math.pow(2, strategy.semitoneShift / 12);
    this.sound.rate(rate, soundId);

    this.sound.volume(1.0, soundId);
  }

  playChord(notes: Note[]) {
    if (!this.isReady || !this.sound) {
      console.warn("Audio was requested, but pianoAudioService was never intialized.");
      return;
    };
    notes.forEach(note => {
      this.playNote(note);
    });
  }

  muteSounds = () => {
    Howler.mute(true);
    this.isMuted = true;
  }
  unMuteSounds = () => {
    Howler.mute(false);
    this.isMuted = false;
  }
}

export const pianoAudioService = new PianoAudioService();