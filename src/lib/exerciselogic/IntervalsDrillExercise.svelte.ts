import { MusicStaff } from "vector-score";
import { TriesComponent } from "./TriesComponent.svelte";
import { TimedFunctionComponent } from "./TimedFunctionComponent.svelte";

const TRIES_COUNT = 3;

export class IntervalsDrillExercise {
  private staffRendererInstance: MusicStaff | null = null;
  private triesComponentInstance: TriesComponent | null;
  private timedFunctionComponentInstance: TimedFunctionComponent | null;

  private currentInterval: string = "M5";
  private currentRoot: string = "C";

  // UI State (variables that will be accessed outside of this class, so getters are made to ensure only instance can change these)
  private _score = $state(0);
  private _correct = $state(0);
  private _isGameOver = $state(true);

  get triesLeft(): number { return this.triesComponentInstance!.triesLeftCount };
  get score(): number { return this._score };
  get correct(): number { return this._correct };
  get isGameOver(): boolean { return this._isGameOver };

  constructor() {
    this.triesComponentInstance = new TriesComponent(TRIES_COUNT, this.handleTriesOut);
    this.timedFunctionComponentInstance = new TimedFunctionComponent();
  }

  private handleTriesOut() {
    this._isGameOver = true;
  }

  setRenderer(renderer: MusicStaff) {
    if (this.staffRendererInstance) return;
    this.staffRendererInstance = renderer;
  }

  // Called by svelte component to kick off the game loop
  startGameLoop() {
    if (!this.staffRendererInstance) throw new Error("Failed to start game. Staff renderer was not instanced.");
    // Create a chord group on staff initally, in order to justify it once
    this.staffRendererInstance.drawChord(["C4", "F4"]);
    this.staffRendererInstance.justifyNotes();


    this._isGameOver = false;
    this.newQuestion();
  }

  newQuestion() {
    if (this._isGameOver) return;
  }
}