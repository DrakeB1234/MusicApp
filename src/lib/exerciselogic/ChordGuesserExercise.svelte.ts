import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import type { MusicStaff, RhythmStaff } from "vector-score";
import { TimedFunctionComponent } from "./TimedFunctionComponent.svelte";
import { TriesComponent } from "./TriesComponent.svelte";
import { NATURAL_NOTE_NAMES, noteToString, noteToVectorScoreString, rhythmStringToVectorScoreData, type Note } from "$lib/helpers/notehelpers";
import type { MidiMessage } from "$lib/midiservice/midiService.svelte";
import { chordStringToNotes, notesToChordString } from "$lib/helpers/chordHelpers";
import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { shuffleArray } from "$lib/helpers/helpers";

type difficulty = "easy" | "medium" | "hard";

type CurrentChord = {
  string: string;
  notes: Note[];
}

export type ExerciseParams = {
  difficulty: string;
};

export type ExercisePresetConfig = {
  allowedChords: string[];
  timeToGuess: number;
  buttonInputCount: number;
  allowedAccidentals: string[] | null;
}

export const exercisePresetParams: Record<difficulty, ExercisePresetConfig> = {
  easy: {
    allowedChords: ["maj", "min", "maj7"],
    timeToGuess: 10,
    buttonInputCount: 3,
    allowedAccidentals: null
  },
  medium: {
    allowedChords: ["maj", "min", "maj7", "min7"],
    timeToGuess: 8,
    buttonInputCount: 4,
    allowedAccidentals: ["#"]
  },
  hard: {
    allowedChords: ["maj", "min", "maj7", "min7", "dim", "sus2"],
    timeToGuess: 6,
    buttonInputCount: 4,
    allowedAccidentals: ["#", "b"]
  },
}

const TRIES_COUNT = 3;

// Represents 1/8 chance
const ACCIDENTAL_CHANCE = 8;

export class ChordGuesserExercise {
  private staffRenderer: MusicStaff | null = null;

  private triesComponent: TriesComponent | null;
  private timedFunctionComponent: TimedFunctionComponent | null;
  private currentChord: CurrentChord;

  score = $state(0);
  correct = $state(0);
  buttonChordStrings: string[] = $state([]);

  private isGameOver = $state(false);
  private currentExerciseParam: ExercisePresetConfig;

  private attemptedInput: boolean = false;
  private isListeningInput: boolean = $state(false);
  private timeLeft: number = $state(0);

  constructor(difficulty: string) {
    let exercisePresetParam = exercisePresetParams[difficulty as difficulty];
    if (!exercisePresetParam) exercisePresetParam = exercisePresetParams.easy;
    this.currentExerciseParam = exercisePresetParam as ExercisePresetConfig;

    this.triesComponent = new TriesComponent(TRIES_COUNT, this.handleTriesOut);
    this.timedFunctionComponent = new TimedFunctionComponent();

    this.currentChord = this.generateNewChord();
  }

  private handleTriesOut = () => {
    this.isGameOver = true;
    this.timeLeft = 0;
  }

  private generateRandomChordString(): string {
    const randomNoteIdx = Math.floor(Math.random() * NATURAL_NOTE_NAMES.length);
    let root = NATURAL_NOTE_NAMES[randomNoteIdx];

    let accidental = "";
    if (this.currentExerciseParam.allowedAccidentals) {
      const randomChance = Math.floor(Math.random() * ACCIDENTAL_CHANCE) + 1;
      const randomAccidentalIdx = Math.floor(Math.random() * this.currentExerciseParam.allowedAccidentals.length);
      if (randomChance === ACCIDENTAL_CHANCE) accidental = this.currentExerciseParam.allowedAccidentals[randomAccidentalIdx];
    }
    root += accidental;

    const randomTypeIdx = Math.floor(Math.random() * this.currentExerciseParam.allowedChords.length);
    const chordSuffix = this.currentExerciseParam.allowedChords[randomTypeIdx];

    return root + chordSuffix;
  }

  private handleCorrect() {
    pianoAudioService.playChord(this.currentChord.notes);
    this.correct++;
    this.timedFunctionComponent!.stop();

    setTimeout(() => {
      this.start();
    }, 1000);
  }

  private handleIncorrect() {
    sfxAudioService.play("wrong");
    this.triesComponent?.decrementTries();
    this.timedFunctionComponent!.stop();

    setTimeout(() => {
      this.start();
    }, 1000);
  }

  private addChordStringsToButtonInput() {
    const options = new Set<string>();
    options.add(this.currentChord.string);

    while (options.size < this.currentExerciseParam.buttonInputCount) {
      const randomWrongChord = this.generateRandomChordString();
      options.add(randomWrongChord);
    };

    this.buttonChordStrings = shuffleArray(Array.from(options));
  }

  setRenderer = (renderer: MusicStaff) => {
    if (this.staffRenderer) return;
    this.staffRenderer = renderer;
  }

  handleMidiInput = (message: MidiMessage) => {
    if (this.isGameOver || !this.isListeningInput) return;
    if (message.type === "noteOn" && message.attackType === "chord") {
      this.handleInput(message.notes);
    }
  }

  handleInput = (chord: string | Note[]) => {
    if (this.isGameOver || !this.isListeningInput) return;

    this.attemptedInput = true;
    if (typeof chord === "string") {
      if (chord === this.currentChord.string) this.handleCorrect();
      else this.handleIncorrect();
    }
    // Otherwise 'chord' is a array
    else {
      const chordString = notesToChordString(chord);
      if (!chordString) return;

      if (chordString === this.currentChord.string) this.handleCorrect();
      else this.handleIncorrect();
    }
  }

  async start() {
    if (this.isGameOver || !this.triesComponent || !this.timedFunctionComponent) return;
    this.attemptedInput = false;
    this.currentChord = this.generateNewChord();

    this.addChordStringsToButtonInput();

    this.staffRenderer!.clearAllNotes();
    this.staffRenderer!.drawChord(this.currentChord.notes.map(e => noteToVectorScoreString(e)));
    this.staffRenderer!.justifyNotes();

    this.isListeningInput = true;
    this.timeLeft = this.currentExerciseParam.timeToGuess;
    await this.timedFunctionComponent.startAndWait(this.currentExerciseParam.timeToGuess, 1000, () => {
      sfxAudioService.play('clickDown');
      this.timeLeft--;
    }, false);
    this.isListeningInput = false;

    if (!this.attemptedInput) {
      this.handleIncorrect();
    }
  }

  get triesString(): string {
    if (!this.triesComponent) return "";
    return String(this.triesComponent.triesLeftCount);
  }

  get timeLeftString(): string {
    if (this.timeLeft === 0) return "-";
    return String(this.timeLeft);
  }

  generateNewChord(): CurrentChord {
    const randomChord = this.generateRandomChordString();

    const randomChordNotes = chordStringToNotes(randomChord, 4);
    return {
      string: randomChord,
      notes: randomChordNotes
    };
  }

  destroy() {
    this.attemptedInput = true;
    if (this.triesComponent) this.triesComponent = null;
    if (this.timedFunctionComponent !== null) {
      this.timedFunctionComponent.stop();
      this.timedFunctionComponent = null;
    }
  }
}