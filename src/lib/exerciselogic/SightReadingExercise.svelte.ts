import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import { absoluteSemitoneToNote, noteToAbsoluteSemitone, noteToString, noteToVectorScoreString, type Note } from "$lib/helpers/notehelpers";
import { type MidiMessage } from "$lib/midiservice/midiService.svelte";
import type { MusicStaff } from "vector-score";
import { TimerComponent } from "./TimerComponent.svelte";

type difficulty = "easy" | "medium" | "hard";

export type ExerciseParams = {
  difficulty: string;
  clef: string;
};

type NoteRange = {
  min: Note;
  max: Note;
};

export type ExercisePresetConfig = {
  noteRanges: Record<string, NoteRange>;
  timer: number;
  allowedAccidentals: string[] | null;
  accidentalChance: number | null;
}

export const exercisePresetParams: Record<difficulty, ExercisePresetConfig> = {
  easy: {
    noteRanges: {
      "grand": {
        min: { name: "F", octave: 3, accidental: null },
        max: { name: "F", octave: 4, accidental: null },
      },
      "treble": {
        min: { name: "C", octave: 4, accidental: null },
        max: { name: "C", octave: 5, accidental: null },
      },
      "bass": {
        min: { name: "C", octave: 3, accidental: null },
        max: { name: "C", octave: 4, accidental: null },
      }
    },
    timer: 60,
    allowedAccidentals: null,
    accidentalChance: null
  },
  medium: {
    noteRanges: {
      "grand": {
        min: { name: "C", octave: 3, accidental: null },
        max: { name: "C", octave: 5, accidental: null },
      },
      "treble": {
        min: { name: "C", octave: 4, accidental: null },
        max: { name: "G", octave: 5, accidental: null },
      },
      "bass": {
        min: { name: "F", octave: 2, accidental: null },
        max: { name: "C", octave: 4, accidental: null },
      }
    },
    timer: 60,
    allowedAccidentals: ["#"],
    accidentalChance: 0.20
  },
  hard: {
    noteRanges: {
      "grand": {
        min: { name: "C", octave: 2, accidental: null },
        max: { name: "C", octave: 6, accidental: null },
      },
      "treble": {
        min: { name: "A", octave: 3, accidental: null },
        max: { name: "C", octave: 6, accidental: null },
      },
      "bass": {
        min: { name: "C", octave: 2, accidental: null },
        max: { name: "E", octave: 4, accidental: null },
      }
    },
    timer: 60,
    allowedAccidentals: ["#", "b"],
    accidentalChance: 0.20
  },
}

const CONSECUTIVE_CORRECT_COUNT = 3;
const CONSECUTIVE_CORRECT_TIME_BONUS = 2;

export class SightreadingExercise {
  private staffRendererInstance: MusicStaff | null = null;
  private timerComponentInstance: TimerComponent | null;

  private consecutiveCorrectNotes: number = 0;
  private minSemitone: number;
  private maxSemitone: number;
  private currentExerciseParam: ExercisePresetConfig;

  // UI State (variables that will be accessed outside of this class, so getters are made to ensure only instance can change these)
  private _score = $state(0);
  private currentNote: Note = { name: "C", octave: 4, accidental: null };
  private _isGameOver = $state(false);
  private correctNotesPlayed: number = 0;
  private totalNotesPlayed: number = $state(0);

  get score(): number { return this._score };
  get isGameOver(): boolean { return this._isGameOver };
  get timeLeft(): string {
    if (!this.timerComponentInstance) return "";
    const str = this.timerComponentInstance.formatTime();
    return str;
  }
  get correctAndTotalNotes(): string {
    return `${this.correctNotesPlayed} / ${this.totalNotesPlayed}`;
  }

  constructor(difficulty: string, clef: string) {
    let exercisePresetParam = exercisePresetParams[difficulty as difficulty];
    if (!exercisePresetParam) exercisePresetParam = exercisePresetParams.easy;
    this.currentExerciseParam = exercisePresetParam as ExercisePresetConfig;

    this.minSemitone = noteToAbsoluteSemitone(this.currentExerciseParam.noteRanges[clef].min);
    this.maxSemitone = noteToAbsoluteSemitone(this.currentExerciseParam.noteRanges[clef].max);

    this.currentNote = this.generateNewNote();
    this.timerComponentInstance = new TimerComponent(this.currentExerciseParam.timer, this.handleTimeout);
    this.timerComponentInstance.start();
  }

  private handleDrawNoteOnStaff(note: Note) {
    if (!this.staffRendererInstance) return;

    this.staffRendererInstance.changeNoteByIndex(noteToVectorScoreString(note), 0);
    this.staffRendererInstance.justifyNotes();
  }

  private handleTimeout = () => {
    this._isGameOver = true;
  }

  private handleCorrectNote(note: Note) {
    if (!note.octave) note.octave = this.currentNote.octave;
    pianoAudioService.playNote(note);

    if (this.consecutiveCorrectNotes >= CONSECUTIVE_CORRECT_COUNT) {
      this.timerComponentInstance?.addTime(CONSECUTIVE_CORRECT_TIME_BONUS);
      this.consecutiveCorrectNotes = 0;
    }
    else {
      this.consecutiveCorrectNotes++;
    }

    this.totalNotesPlayed += 1;
    this.correctNotesPlayed += 1;

    const newNote = this.generateNewNote();
    this.currentNote = newNote;

  }

  private handleIncorrectNote(note: Note) {
    this.totalNotesPlayed += 1;
    this.consecutiveCorrectNotes = 0;

    sfxAudioService.play("wrong");
  }

  setRenderer(renderer: MusicStaff) {
    if (this.staffRendererInstance) return;
    this.staffRendererInstance = renderer;
    const vsNoteStr = noteToVectorScoreString(this.currentNote);
    this.staffRendererInstance.drawNote(vsNoteStr);
    this.staffRendererInstance.justifyNotes();
  }

  handleMidiInput = (message: MidiMessage) => {
    if (this._isGameOver) return;
    if (message.type === "noteOn" && message.attackType === "single") {
      this.handleNoteInput(message.notes[0]);
    }
    else if (message.attackType === "chord") {
      this.handleIncorrectNote(message.notes[0]);
    }
  }

  handleNoteInput = (note: Note) => {
    if (this._isGameOver) return;
    const tempCurrentNote = { ...this.currentNote };

    if (!note.octave) {
      tempCurrentNote.octave = null;
    }

    if (noteToAbsoluteSemitone(note) === noteToAbsoluteSemitone(tempCurrentNote)) this.handleCorrectNote(note);
    else this.handleIncorrectNote(note);
  }

  destroy() {
    if (!this.timerComponentInstance) return;
    this.timerComponentInstance.stop();
    this.timerComponentInstance = null;
    this.staffRendererInstance = null;
  }

  generateNewNote(): Note {
    const lastNoteSemitone = noteToAbsoluteSemitone(this.currentNote);

    const randomSemitone = Math.floor(Math.random() * (this.maxSemitone - this.minSemitone + 1)) + this.minSemitone;
    let newSemitone = randomSemitone;

    if (randomSemitone === lastNoteSemitone) {
      newSemitone += 2;
      if (newSemitone > this.maxSemitone) newSemitone = this.minSemitone;
    }

    let note = absoluteSemitoneToNote(newSemitone);
    note.accidental = null;

    if (this.currentExerciseParam.accidentalChance && Math.random() < this.currentExerciseParam.accidentalChance) {
      if (this.currentExerciseParam.allowedAccidentals) {
        const randomAccidentalIdx = Math.floor(Math.random() * this.currentExerciseParam.allowedAccidentals.length);
        const newAccidental = this.currentExerciseParam.allowedAccidentals[randomAccidentalIdx];
        note.accidental = newAccidental;
      };
    };

    this.handleDrawNoteOnStaff(note);

    return note;
  }
}