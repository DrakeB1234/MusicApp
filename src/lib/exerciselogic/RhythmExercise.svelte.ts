import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import { absoluteSemitoneToNote, noteToAbsoluteSemitone, noteToString, type Note } from "$lib/helpers/notehelpers";
import { type MidiMessage } from "$lib/midiservice/midiService.svelte";
import type { SingleStaffRenderer } from "$lib/sola-score";
import { TimedFunctionComponent } from "./TimedFunctionComponent.svelte";
import { TimerComponent } from "./TimerComponent.svelte";
import { TriesComponent } from "./TriesComponent.svelte";

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
    allowedRests: ["w"]
  },
  medium: {
    allowedNoteDurations: ["w", "h", "q", "e"],
    allowedRests: ["w"]
  },
  hard: {
    allowedNoteDurations: ["w", "h", "q", "e"],
    allowedRests: ["w"]
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
const TAP_THRESHOLD_MS = 150;

// const testTapTimestamps = [0, 750, 1500, 2250];
const testTapTimestamps = [0, 325, 750, 1075, 1500, 1825, 2250, 2575];

export class RhythmExercise {
  private staffRenderer: SingleStaffRenderer | null = null;

  private triesComponent: TriesComponent | null;
  private timedFunctionComponent: TimedFunctionComponent | null;

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

    this.triesComponent = new TriesComponent(TRIES_COUNT, this.handleTriesOut);
    this.timedFunctionComponent = new TimedFunctionComponent();
  }

  private handleTriesOut = () => {
    this.isGameOver = true;
    this.timedFunctionComponent?.stop();
  }

  private generateTimeStamps() {
    this.timeStampEntries = [];

    const totalBars = 1;
    const beatsPerBar = 4;
    let currentAccumulatedBeats = 0;

    for (let b = 0; b < totalBars; b++) {
      let beatsInCurrentBar = 0;

      while (beatsInCurrentBar < beatsPerBar) {

        const remainingSpace = beatsPerBar - beatsInCurrentBar;

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

  test = () => {
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

        if (difference > TAP_THRESHOLD_MS) {
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
    this.triesComponent?.decrementTries();

    setTimeout(() => {
      this.start();
    }, 1000);
  }

  private cleanInput() {
    this.inputData = [];
  }

  async start() {
    if (this.isGameOver || !this.timedFunctionComponent || !this.triesComponent) return;

    this.generateTimeStamps();

    // Starts inital countdown
    this.currentStartCount = 5;
    await this.timedFunctionComponent.startAndWait(5, BPM_MS, () => {
      this.currentStartCount--;
      if (this.currentStartCount <= 0) return;
      if (this.currentStartCount === 4) sfxAudioService.play("clickUp");
      else sfxAudioService.play("clickDown");
    });

    // Starts input listener
    if (!this.timedFunctionComponent) return;
    this.cleanInput();
    this.isListeningInput = true;
    let listeningStartTime = Date.now();

    let currentTapCount = 5;
    await this.timedFunctionComponent.startAndWait(5, BPM_MS, () => {
      currentTapCount--;
      if (currentTapCount <= 0) return;
      if (currentTapCount === 4) sfxAudioService.play("clickUp");
      else sfxAudioService.play("clickDown");
    });
    this.isListeningInput = false;

    this.validateInput(listeningStartTime);
  }

  handleInput = () => {
    if (this.isGameOver || !this.isListeningInput) return;
    const timestamp = Date.now();
    this.inputData.push(timestamp);
  }

  reset = () => {
    if (!this.isGameOver) return;

    this.timedFunctionComponent?.stop();
    this.triesComponent?.resetTries();
    this.cleanInput();
    this.currentStartCount = 0;
    this.isGameOver = false;

    this.start();

    return;
  }

  get triesString(): string {
    if (!this.triesComponent) return "";
    return String(this.triesComponent.triesLeftCount);
  }

  get currentStartTimeCount(): string {
    if (this.currentStartCount === 0) return "-";
    return String(this.currentStartCount);
  }

  get currentNoteStrings(): string[] {
    return this.timeStampEntries.map(e => e.note);
  }

  destroy() {
    if (this.triesComponent) this.triesComponent = null;
    if (this.timedFunctionComponent) {
      this.timedFunctionComponent.stop();
      this.timedFunctionComponent = null;
    }
  }
}