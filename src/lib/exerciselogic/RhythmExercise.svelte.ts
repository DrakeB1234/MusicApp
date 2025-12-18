import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import type { RhythmStaff } from "vector-score";
import { TimedFunctionComponent } from "./TimedFunctionComponent.svelte";
import { TriesComponent } from "./TriesComponent.svelte";
import { rhythmStringToVectorScoreData } from "$lib/helpers/notehelpers";

type difficulty = "easy" | "medium" | "hard";

export type ExerciseParams = {
  difficulty: string;
};

export type ExercisePresetConfig = {
  durationBarPatterns: string[][];
}

export const exercisePresetParams: Record<difficulty, ExercisePresetConfig> = {
  easy: {
    // durationBarPatterns: [['q', 'q', 'q', 'q'], ['q', 'h', 'q'], ['h', 'q', 'q'], ['w'], ['q', 'q', 'h'], ['h', 'h'], ['q', 'rq', 'q', 'rq']],
    durationBarPatterns: [['q', 'q', 'q', 'q'], ['h', 'h'], ['q', 'rq', 'q', 'rq']],
  },
  medium: {
    durationBarPatterns: [['e', 'e', 'q', 'h'], ['h', 'e', 'e', 'e', 'e'], ['q', 'h', 'e', 'e'], ['q', 'q', 'q', 'q'], ['e', 'e', 'e', 'e', 'h'], ['q', 'e', 'e', 'q', 'q']],
  },
  hard: {
    durationBarPatterns: [['q', 'q', 'q', 'q']],
  },
}

const noteValuesMap: Record<string, number> = {
  "w": 4,
  "h": 2,
  "q": 1,
  "e": 0.5,
  "s": 0.25,
  "rw": 4,
  "rh": 2,
  "rq": 1,
  "re": 0.5
};

const BPM_MS = 750;

const TRIES_COUNT = 3;
const TAP_THRESHOLD_MS = 175;
const BARS_COUNT = 2;
const BEATS_PER_BAR = 4;

const WAIT_TIME_AFTER_TRY_MS = 1000;

// const testTapTimestamps = [0, 750, 1500, 2250];
const testTapTimestamps = [0, 325, 750, 1075, 1500, 1825, 2250, 2575];

export class RhythmExercise {
  private staffRendererInstance: RhythmStaff | null = null;
  private triesComponentInstance: TriesComponent | null;
  private timedFunctionComponentInstance: TimedFunctionComponent | null;

  private currentExerciseParam: ExercisePresetConfig;
  private inputData: number[] = [];
  private timeStampEntries: number[] = [];

  // UI State (variables that will be accessed outside of this class, so getters are made to ensure only instance can change these)
  private _score = $state(0);
  private _correct = $state(0);
  private _isListeningInput: boolean = $state(false);
  private _currentStartTime: number = $state(0);
  private _isGameOver = $state(false);
  private _currentNoteStrings: string[] = $state([]);

  get triesLeft(): number { return this.triesComponentInstance!.triesLeftCount };
  get score(): number { return this._score };
  get correct(): number { return this._correct };
  get currentNoteStrings(): string[] { return this._currentNoteStrings };
  get isListeningInput(): boolean { return this._isListeningInput };
  get currentStartTime(): string {
    if (this._currentStartTime === 0) return "-";
    return String(this._currentStartTime);
  }

  constructor(difficulty: string) {
    let exercisePresetParam = exercisePresetParams[difficulty as difficulty];
    if (!exercisePresetParam) exercisePresetParam = exercisePresetParams.easy;
    this.currentExerciseParam = exercisePresetParam as ExercisePresetConfig;

    this.triesComponentInstance = new TriesComponent(TRIES_COUNT, this.handleTriesOut);
    this.timedFunctionComponentInstance = new TimedFunctionComponent();
  }

  private handleTriesOut = () => {
    this._isGameOver = true;
    this.timedFunctionComponentInstance?.stop();
  }

  private generateTimeStamps() {
    let generatedNoteStrings: string[] = [];
    this.timeStampEntries = [];

    let currentAccumulatedTime = 0;
    const possiblePatterns = this.currentExerciseParam.durationBarPatterns;

    for (let b = 0; b < BARS_COUNT; b++) {
      const randomIndex = Math.floor(Math.random() * possiblePatterns.length);
      const selectedPattern = possiblePatterns[randomIndex];

      for (const noteKey of selectedPattern) {
        this.timeStampEntries.push(currentAccumulatedTime);
        generatedNoteStrings.push(noteKey);

        const beatValue = noteValuesMap[noteKey];
        currentAccumulatedTime += beatValue * BPM_MS;
      }
    }

    this._currentNoteStrings = generatedNoteStrings;
  }

  private validateInput(listeningStartTime: number) {
    let pass = true;
    if (this.inputData.length !== this.timeStampEntries.length) {
      pass = false;
    }
    else {
      this.inputData.forEach((e, i) => {
        const inputTimestamp = e - listeningStartTime;
        const difference = inputTimestamp - this.timeStampEntries[i];

        if (difference > TAP_THRESHOLD_MS || difference < 0) {
          pass = false;
        }
      });
    }
    if (pass) this.handleCorrect();
    else this.handleIncorrect();
  }

  private handleCorrect() {
    sfxAudioService.play("correct");
    this._correct++;

    setTimeout(() => {
      this.start();
    }, WAIT_TIME_AFTER_TRY_MS);
  }

  private handleIncorrect() {
    sfxAudioService.play("wrong");
    this.triesComponentInstance?.decrementTries();

    setTimeout(() => {
      this.start();
    }, WAIT_TIME_AFTER_TRY_MS);
  }

  private cleanInput() {
    this.inputData = [];
  }

  setRenderer = (renderer: RhythmStaff) => {
    if (this.staffRendererInstance) return;
    this.staffRendererInstance = renderer;
  }

  async start() {
    if (this._isGameOver || !this.timedFunctionComponentInstance || !this.triesComponentInstance) return;

    this.generateTimeStamps();
    this.staffRendererInstance!.clearAllNotes();
    const staffData = rhythmStringToVectorScoreData(this._currentNoteStrings);

    staffData.forEach(noteGroup => {
      // If sub arr is all 'e' notes, draw a beamed note
      if (noteGroup.length > 1 && noteGroup.every(note => note === "e")) {
        this.staffRendererInstance!.drawBeamedNotes("e", noteGroup.length);
      }
      // else, draw regular notes
      else {
        this.staffRendererInstance!.drawNote(noteGroup);
      }
    });

    const startIterationCount = BEATS_PER_BAR + 1;
    const inputIterationCount = BARS_COUNT * BEATS_PER_BAR + 1;

    // Starts inital countdown
    this._currentStartTime = startIterationCount;
    await this.timedFunctionComponentInstance.startAndWait(startIterationCount, BPM_MS, () => {
      this._currentStartTime--;
      if (this._currentStartTime <= 0) return;
      if (this._currentStartTime === 4) sfxAudioService.play("clickUp");
      else sfxAudioService.play("clickDown");
    });

    // Starts input listener
    if (!this.timedFunctionComponentInstance) return;
    this.cleanInput();
    this._isListeningInput = true;
    let listeningStartTime = Date.now();

    let currentInputCount = inputIterationCount;
    await this.timedFunctionComponentInstance.startAndWait(inputIterationCount, BPM_MS, () => {
      currentInputCount--;
      if (currentInputCount <= 0) return;
      if (currentInputCount % 4 === 0) sfxAudioService.play("clickUp");
      else sfxAudioService.play("clickDown");
      this.staffRendererInstance!.incrementCurrentBeatUI();
    });
    this._isListeningInput = false;
    this.staffRendererInstance!.resetCurrentBeatUI();

    this.validateInput(listeningStartTime);
  }

  handleInput = () => {
    if (this._isGameOver || !this._isListeningInput) return;
    const timestamp = Date.now();
    this.inputData.push(timestamp);
  }

  reset = () => {
    if (!this._isGameOver) return;

    this.timedFunctionComponentInstance?.stop();
    this.triesComponentInstance?.resetTries();
    this.cleanInput();
    this._currentStartTime = 0;
    this._isGameOver = false;

    this.start();

    return;
  }

  destroy() {
    if (this.triesComponentInstance) this.triesComponentInstance = null;
    if (this.timedFunctionComponentInstance) {
      this.timedFunctionComponentInstance.stop();
      this.timedFunctionComponentInstance = null;
    }
  }
}