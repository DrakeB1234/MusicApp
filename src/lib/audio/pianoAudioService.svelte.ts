import { NOTE_TO_INDEX, type Note } from '$lib/helpers/notehelpers';
import { Howl, Howler } from 'howler';

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
    if (note.octave === null) return null;

    const targetIndex = NOTE_TO_INDEX[note.name.toUpperCase()];
    if (targetIndex === undefined) return null;

    if (note.octave >= 8) {
      return { sampleName: 'C8', semitoneShift: targetIndex };
    }

    const distToC = Math.abs(targetIndex - 0);
    const distToG = Math.abs(targetIndex - 7);
    const distToNextC = Math.abs(targetIndex - 12);

    let sampleName = "";
    let semitoneShift = 0;

    if (distToNextC < distToG) {
      sampleName = `C${note.octave + 1}`;
      semitoneShift = targetIndex - 12;
    }
    else if (distToG < distToC) {
      sampleName = `G${note.octave}`;
      semitoneShift = targetIndex - 7;
    }
    else {
      sampleName = `C${note.octave}`;
      semitoneShift = targetIndex - 0;
    }

    if (note.accidental === "#") semitoneShift += 1;
    else if (note.accidental === "b") semitoneShift -= 1;

    return { sampleName, semitoneShift };
  }

  playNote(note: Note) {
    if (!this.isReady || !this.sound) return;

    const strategy = this.calculateStrategy(note);
    if (!strategy) return;

    const soundId = this.sound.play(strategy.sampleName);

    const rate = Math.pow(2, strategy.semitoneShift / 12);
    this.sound.rate(rate, soundId);

    this.sound.volume(1.0, soundId);
  }

  playChord(notes: Note[]) {
    if (!this.isReady || !this.sound) return;

    notes.forEach(note => {
      this.playNote(note);
    });
  }

  muteSounds = () => {
    Howler.mute(true);
    this.isMuted = true;
  }
  unMuteSounds = () => {
    console.log(Howler.noAudio)
    Howler.mute(false);
    this.isMuted = false;
  }
}

export const pianoAudioService = new PianoAudioService();