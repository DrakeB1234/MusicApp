import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import type { MusicStaff, RhythmStaff } from "vector-score";
import { TimedFunctionComponent } from "./TimedFunctionComponent.svelte";
import { TriesComponent } from "./TriesComponent.svelte";
import { NATURAL_NOTE_NAMES, noteToString, noteToVectorScoreString, rhythmStringToVectorScoreData, type Note } from "$lib/helpers/notehelpers";
import type { MidiMessage } from "$lib/midiservice/midiService.svelte";
import { chordStringToNotes, notesToChordString } from "$lib/helpers/chordHelpers";
import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";

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
}

export const exercisePresetParams: Record<difficulty, ExercisePresetConfig> = {
  easy: {
    allowedChords: ["maj", "min"],
    timeToGuess: 10
  },
  medium: {
    allowedChords: ["maj", "min", "maj7", "min7"],
    timeToGuess: 8
  },
  hard: {
    allowedChords: ["h", "q", "e"],
    timeToGuess: 6
  },
}

const TRIES_COUNT = 3;

export class ChordGuesserExercise {
  private staffRenderer: MusicStaff | null = null;

  private triesComponent: TriesComponent | null;
  private timedFunctionComponent: TimedFunctionComponent | null;
  private currentChord: CurrentChord;

  score = $state(0);
  correct = $state(0);
  incorrectChord = $state("");

  private isGameOver = $state(false);
  private currentExerciseParam: ExercisePresetConfig;

  private attemptedInput: boolean = false;
  private isListeningInput: boolean = false;
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
  }

  setRenderer = (renderer: MusicStaff) => {
    if (this.staffRenderer) return;
    this.staffRenderer = renderer;
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
      if (chordString === this.currentChord.string) this.handleCorrect();
      else this.handleIncorrect();
    }
  }

  async start() {
    if (this.isGameOver || !this.triesComponent || !this.timedFunctionComponent) return;
    this.attemptedInput = false;
    this.currentChord = this.generateNewChord();
    this.staffRenderer!.clearAllNotes();
    this.staffRenderer!.drawChord(this.currentChord.notes.map(e => noteToVectorScoreString(e)));
    console.log(this.currentChord)

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
    const randomRootIdx = Math.round(Math.random() * (NATURAL_NOTE_NAMES.length - 1));
    const randomRoot = NATURAL_NOTE_NAMES[randomRootIdx];

    const randomChordIdx = Math.round(Math.random() * (this.currentExerciseParam.allowedChords.length - 1));
    const randomChordString = this.currentExerciseParam.allowedChords[randomChordIdx];

    const fullChordString = randomRoot + randomChordString;

    const randomChordNotes = chordStringToNotes(fullChordString, 4);
    return {
      string: fullChordString,
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