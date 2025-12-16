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
  allowedNoteDurations: string[];
  allowedRests: string[];
}

type TimeStampEntry = {
  timeStamp: number;
  note: string;
}

export const exercisePresetParams: Record<difficulty, ExercisePresetConfig> = {
  easy: {
    allowedNoteDurations: ["w", "h", "q"],
    allowedRests: ["q"]
  },
  medium: {
    allowedNoteDurations: ["h", "q", "e"],
    allowedRests: ["q, e"]
  },
  hard: {
    allowedNoteDurations: ["h", "q", "e"],
    allowedRests: ["h, q, e"]
  },
}

const noteValuesMap: Record<string, number> = {
  "w": 4,
  "h": 2,
  "q": 1,
  "e": 0.5
};

const BPM_MS = 750;

const TRIES_COUNT = 3;
const TAP_THRESHOLD_MS = 175;
const BARS_COUNT = 2;
const BEATS_PER_BAR = 4;

// const testTapTimestamps = [0, 750, 1500, 2250];
const testTapTimestamps = [0, 325, 750, 1075, 1500, 1825, 2250, 2575];

export class RhythmExercise {
  private staffRenderer: RhythmStaff | null = null;

  private triesComponentInstance: TriesComponent | null;
  private timedFunctionComponentInstance: TimedFunctionComponent | null;

  score = $state(0);
  correct = $state(0);
  private isListeningInput: boolean = false;
  private inputData: number[] = [];
  private currentStartCount: number = $state(0);
  private isGameOver = $state(false);
  private currentExerciseParam: ExercisePresetConfig;
  private timeStampEntries: TimeStampEntry[] = $state([]);

  constructor(difficulty: string) {
    let exercisePresetParam = exercisePresetParams[difficulty as difficulty];
    if (!exercisePresetParam) exercisePresetParam = exercisePresetParams.easy;
    this.currentExerciseParam = exercisePresetParam as ExercisePresetConfig;

    this.triesComponentInstance = new TriesComponent(TRIES_COUNT, this.handleTriesOut);
    this.timedFunctionComponentInstance = new TimedFunctionComponent();
  }

  private handleTriesOut = () => {
    this.isGameOver = true;
    this.timedFunctionComponentInstance?.stop();
  }

  private generateTimeStamps() {
    this.timeStampEntries = [];

    let currentAccumulatedBeats = 0;

    for (let b = 0; b < BARS_COUNT; b++) {
      let beatsInCurrentBar = 0;

      while (beatsInCurrentBar < BEATS_PER_BAR) {

        const remainingSpace = BEATS_PER_BAR - beatsInCurrentBar;

        const validNotes = this.currentExerciseParam.allowedNoteDurations.filter(noteKey => {
          const beatValue = noteValuesMap[noteKey];
          return beatValue <= remainingSpace;
        });

        if (validNotes.length === 0) break;

        const randomNoteKey = validNotes[Math.floor(Math.random() * validNotes.length)];
        const noteBeatValue = noteValuesMap[randomNoteKey];

        this.timeStampEntries.push({
          timeStamp: currentAccumulatedBeats,
          note: randomNoteKey
        });

        currentAccumulatedBeats += noteBeatValue * BPM_MS;

        beatsInCurrentBar += noteBeatValue;
      }
    }
  }

  setRenderer = (renderer: RhythmStaff) => {
    if (this.staffRenderer) return;
    this.staffRenderer = renderer;
  }

  private validateInput(listeningStartTime: number) {

    let pass = true;
    if (this.inputData.length !== this.timeStampEntries.length) {
      pass = false;
    }
    else {
      this.inputData.forEach((e, i) => {
        const inputTimestamp = e - listeningStartTime;
        const difference = inputTimestamp - this.timeStampEntries[i].timeStamp;

        if (difference > TAP_THRESHOLD_MS || difference < 0) {
          pass = false
        }
      });
    }
    if (pass) this.handleCorrect();
    else this.handleIncorrect();
  }

  private handleCorrect() {
    sfxAudioService.play("correct");
    this.correct++;

    setTimeout(() => {
      this.start();
    }, 1000);
  }

  private handleIncorrect() {
    sfxAudioService.play("wrong");
    this.triesComponentInstance?.decrementTries();

    setTimeout(() => {
      this.start();
    }, 1000);
  }

  private cleanInput() {
    this.inputData = [];
  }

  async start() {
    if (this.isGameOver || !this.timedFunctionComponentInstance || !this.triesComponentInstance) return;

    this.generateTimeStamps();
    const noteStrings = this.timeStampEntries.map(e => e.note);
    const staffData = rhythmStringToVectorScoreData(noteStrings);

    this.staffRenderer!.clearAllNotes();
    staffData.forEach(noteGroup => {
      // If sub arr is all 'e' notes, draw a beamed note
      if (noteGroup.length > 1 && noteGroup.every(note => note === "e")) {
        this.staffRenderer!.drawBeamedNotes("e", noteGroup.length);
      }
      // else, draw regular notes
      else {
        this.staffRenderer!.drawNote(noteGroup);
      }
    });

    const startIterationCount = BEATS_PER_BAR + 1;
    const inputIterationCount = BARS_COUNT * BEATS_PER_BAR + 1;

    // Starts inital countdown
    this.currentStartCount = startIterationCount;
    await this.timedFunctionComponentInstance.startAndWait(startIterationCount, BPM_MS, () => {
      this.currentStartCount--;
      if (this.currentStartCount <= 0) return;
      if (this.currentStartCount === 4) sfxAudioService.play("clickUp");
      else sfxAudioService.play("clickDown");
    });

    // Starts input listener
    if (!this.timedFunctionComponentInstance) return;
    this.cleanInput();
    this.isListeningInput = true;
    let listeningStartTime = Date.now();

    let currentInputCount = inputIterationCount;
    await this.timedFunctionComponentInstance.startAndWait(inputIterationCount, BPM_MS, () => {
      currentInputCount--;
      if (currentInputCount <= 0) return;
      if (currentInputCount % 4 === 0) sfxAudioService.play("clickUp");
      else sfxAudioService.play("clickDown");
      this.staffRenderer!.incrementCurrentBeatUI();
    });
    this.isListeningInput = false;
    this.staffRenderer!.resetCurrentBeatUI();

    this.validateInput(listeningStartTime);
  }

  handleInput = () => {
    if (this.isGameOver || !this.isListeningInput) return;
    const timestamp = Date.now();
    this.inputData.push(timestamp);
  }

  reset = () => {
    if (!this.isGameOver) return;

    this.timedFunctionComponentInstance?.stop();
    this.triesComponentInstance?.resetTries();
    this.cleanInput();
    this.currentStartCount = 0;
    this.isGameOver = false;

    this.start();

    return;
  }

  get triesString(): string {
    if (!this.triesComponentInstance) return "";
    return String(this.triesComponentInstance.triesLeftCount);
  }

  get currentStartTimeCount(): string {
    if (this.currentStartCount === 0) return "-";
    return String(this.currentStartCount);
  }

  get currentNoteStrings(): string[] {
    return this.timeStampEntries.map(e => e.note);
  }

  destroy() {
    if (this.triesComponentInstance) this.triesComponentInstance = null;
    if (this.timedFunctionComponentInstance) {
      this.timedFunctionComponentInstance.stop();
      this.timedFunctionComponentInstance = null;
    }
  }
}