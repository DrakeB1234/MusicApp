import { MusicStaff } from "vector-score";
import { TriesComponent } from "./TriesComponent.svelte";
import { TimedFunctionComponent } from "./TimedFunctionComponent.svelte";
import { absoluteSemitoneToNote, NATURAL_NOTE_NAMES, noteToAbsoluteSemitone, noteToVectorScoreString, type Note } from "$lib/helpers/notehelpers";
import { INTERVAL_DISTANCES } from "$lib/helpers/chordHelpers";
import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { shuffleArray } from "$lib/helpers/helpers";

type IntervalQuestion = {
  root: Note;
  interval: string;
  notes: Note[];
};

const TRIES_COUNT = 3;
const OCTAVE = 4;

export class IntervalsDrillExercise {
  private staffRendererInstance: MusicStaff | null = null;
  private triesComponentInstance: TriesComponent | null;
  private timedFunctionComponentInstance: TimedFunctionComponent | null;

  private currentQuestion: IntervalQuestion | null = null;

  // UI State (variables that will be accessed outside of this class, so getters are made to ensure only instance can change these)
  private _score = $state(0);
  private _correct = $state(0);
  private _isGameOver = $state(false);
  private _buttonValues: string[] = $state([]);
  private _isListeningInput: boolean = $state(false);

  get triesLeft(): number { return this.triesComponentInstance!.triesLeftCount };
  get score(): number { return this._score };
  get correct(): number { return this._correct };
  get isGameOver(): boolean { return this._isGameOver };
  get buttonValues(): string[] { return this._buttonValues; }
  get isListeningInput(): boolean { return this._isListeningInput; }

  constructor() {
    this.triesComponentInstance = new TriesComponent(TRIES_COUNT, this.handleTriesOut);
    this.timedFunctionComponentInstance = new TimedFunctionComponent();
  }

  private handleTriesOut = () => {
    this._isGameOver = true;
    this._isListeningInput = false;
  }

  private generateNewInterval() {
    const randomName = NATURAL_NOTE_NAMES[Math.floor(Math.random() * NATURAL_NOTE_NAMES.length)];
    const rootNote: Note = {
      name: randomName,
      octave: OCTAVE,
      accidental: null
    };

    const intervals = Object.keys(INTERVAL_DISTANCES);
    const randomIntervalString = intervals[Math.floor(Math.random() * intervals.length)];
    const semitoneDistance = INTERVAL_DISTANCES[randomIntervalString];

    const rootSemitone = noteToAbsoluteSemitone(rootNote);
    const targetSemitone = rootSemitone + semitoneDistance;

    const targetNote = absoluteSemitoneToNote(targetSemitone);

    // Generate random button values
    const wrongAnswers = intervals.filter(i => i !== randomIntervalString);
    const wrongButtonValues = wrongAnswers.slice(0, 3);
    this._buttonValues = shuffleArray([randomIntervalString, ...wrongButtonValues]);

    this.currentQuestion = {
      root: rootNote,
      interval: randomIntervalString,
      notes: [rootNote, targetNote],
    };
  }

  setRenderer(renderer: MusicStaff) {
    if (this.staffRendererInstance) return;
    this.staffRendererInstance = renderer;
  }

  // Called by svelte component to kick off the game loop
  startGameLoop() {
    if (!this.staffRendererInstance) throw new Error("Failed to start game. Staff renderer was not instanced.");
    // Create a chord group on staff initally, in order to justify it once
    this.generateNewInterval();
    const vectorNotes = this.currentQuestion!.notes.map(e => noteToVectorScoreString(e));
    this.staffRendererInstance.drawChord(vectorNotes);
    this.staffRendererInstance.justifyNotes();


    this.newQuestion();
  }

  newQuestion() {
    if (this._isGameOver) return;

    this.generateNewInterval();
    const vectorNotes = this.currentQuestion!.notes.map(e => noteToVectorScoreString(e));
    this.staffRendererInstance?.changeChordByIndex(vectorNotes, 0);
    this._isListeningInput = true;
    this.handlePlayInterval();
  }

  handleInput = (value: string) => {
    this._isListeningInput = false;
    if (!this.currentQuestion || this._isGameOver) return;
    if (value === this.currentQuestion.interval) this.handleCorrect();
    else this.handleIncorrect();

    setTimeout(() => {
      this.newQuestion();
    }, 2000);
  }

  handleCorrect() {
    pianoAudioService.playChord(this.currentQuestion!.notes);
    this._correct++;
  }

  handleIncorrect() {
    sfxAudioService.play("wrong");

    this.triesComponentInstance?.decrementTries();
  }

  async handlePlayInterval() {
    let noteIdx = 0;
    await this.timedFunctionComponentInstance?.startAndWait(2, 1500, () => {
      pianoAudioService.playNote(this.currentQuestion!.notes[noteIdx]);
      noteIdx++;
    });
  }

  destroy() {
    if (this.triesComponentInstance) this.triesComponentInstance = null;
    if (this.timedFunctionComponentInstance) {
      this.timedFunctionComponentInstance.stop();
      this.timedFunctionComponentInstance = null;
    }
  }
}