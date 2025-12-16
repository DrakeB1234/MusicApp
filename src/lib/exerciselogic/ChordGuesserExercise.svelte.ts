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
    allowedChords: ["maj", "min"],
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

const WAIT_TIME_AFTER_TRY_MS = 2000;

export class ChordGuesserExercise {
  private staffRendererInstance: MusicStaff | null = null;
  private triesComponentInstance: TriesComponent | null;
  private timedFunctionComponentInstance: TimedFunctionComponent | null;
  private currentChord: CurrentChord;

  private currentExerciseParam: ExercisePresetConfig;
  private attemptedInput: boolean = false;

  // UI State (variables that will be accessed outside of this class, so getters are made to ensure only instance can change these)
  private _score = $state(0);
  private _correct = $state(0);
  private _buttonChordStrings: string[] = $state([]);
  private _isGameOver = $state(false);
  private _isListeningInput: boolean = $state(false);
  private _timeLeft: number = $state(0);

  get triesLeft(): number { return this.triesComponentInstance!.triesLeftCount };
  get timeLeft(): number { return this._timeLeft };
  get score(): number { return this._score };
  get correct(): number { return this._correct };
  get isListeningInput(): boolean { return this._isListeningInput };
  get buttonChordStrings(): string[] { return this._buttonChordStrings };

  constructor(difficulty: string) {
    let exercisePresetParam = exercisePresetParams[difficulty as difficulty];
    if (!exercisePresetParam) exercisePresetParam = exercisePresetParams.easy;
    this.currentExerciseParam = exercisePresetParam as ExercisePresetConfig;

    this.triesComponentInstance = new TriesComponent(TRIES_COUNT, this.handleTriesOut);
    this.timedFunctionComponentInstance = new TimedFunctionComponent();

    this.currentChord = this.generateNewChord();
  }

  private handleTriesOut = () => {
    this._isGameOver = true;
    this._timeLeft = 0;
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
    this._correct++;
    this.timedFunctionComponentInstance!.stop();

    setTimeout(() => {
      this.start();
    }, WAIT_TIME_AFTER_TRY_MS);
  }

  private handleIncorrect() {
    sfxAudioService.play("wrong");
    this.triesComponentInstance?.decrementTries();
    this.timedFunctionComponentInstance!.stop();

    setTimeout(() => {
      this.start();
    }, WAIT_TIME_AFTER_TRY_MS);
  }

  private addChordStringsToButtonInput() {
    const options = new Set<string>();
    options.add(this.currentChord.string);

    while (options.size < this.currentExerciseParam.buttonInputCount) {
      const randomWrongChord = this.generateRandomChordString();
      options.add(randomWrongChord);
    };

    this._buttonChordStrings = shuffleArray(Array.from(options));
  }

  setRenderer = (renderer: MusicStaff) => {
    if (this.staffRendererInstance) return;
    this.staffRendererInstance = renderer;
  }

  handleMidiInput = (message: MidiMessage) => {
    if (this._isGameOver || !this._isListeningInput) return;
    if (message.type === "noteOn" && message.attackType === "chord") {
      this.handleInput(message.notes);
    }
  }

  handleInput = (chord: string | Note[]) => {
    if (this._isGameOver || !this._isListeningInput) return;

    this.attemptedInput = true;
    if (typeof chord === "string") {
      if (chord === this.currentChord.string) this.handleCorrect();
      else this.handleIncorrect();
    }
    else {
      const chordString = notesToChordString(chord);
      if (chordString === this.currentChord.string) this.handleCorrect();
      else this.handleIncorrect();
    }
  }

  async start() {
    if (this._isGameOver || !this.triesComponentInstance || !this.timedFunctionComponentInstance) return;
    this.attemptedInput = false;
    this.currentChord = this.generateNewChord();

    this.addChordStringsToButtonInput();

    this.staffRendererInstance!.clearAllNotes();
    this.staffRendererInstance!.drawChord(this.currentChord.notes.map(e => noteToVectorScoreString(e)));
    this.staffRendererInstance!.justifyNotes();

    this._isListeningInput = true;
    this._timeLeft = this.currentExerciseParam.timeToGuess;
    await this.timedFunctionComponentInstance.startAndWait(this.currentExerciseParam.timeToGuess, 1000, () => {
      sfxAudioService.play('clickDown');
      this._timeLeft--;
    }, false);
    this._isListeningInput = false;

    // This flag is due to user input, if the user inputs (whether correct/incorrect) it is handled by its own method. If time runs out
    // and the user never inputted anything, then the answer is incorrect.
    if (!this.attemptedInput) {
      this.handleIncorrect();
    }
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
    if (this.triesComponentInstance) this.triesComponentInstance = null;
    if (this.timedFunctionComponentInstance !== null) {
      this.timedFunctionComponentInstance.stop();
      this.timedFunctionComponentInstance = null;
    }
  }
}