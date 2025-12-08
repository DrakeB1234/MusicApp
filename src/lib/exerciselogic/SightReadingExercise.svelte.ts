import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import { absoluteSemitoneToNote, noteToAbsoluteSemitone, noteToString, type Note } from "$lib/helpers/notehelpers";
import { type MidiMessage } from "$lib/midiservice/midiService.svelte";
import type { SingleStaffRenderer } from "$lib/sola-score";
import { TimerComponent } from "./TimerComponent.svelte";

type difficulty = "easy" | "medium" | "hard";

export type ExerciseParams = {
  difficulty: string;
  clef: string;
};

export type ExercisePresetConfig = {
  minNote: Note;
  maxNote: Note;
  timer: number;
  allowedAccidentals: string[] | null;
  accidentalChance: number | null;
}

export const exercisePresetParams: Partial<Record<difficulty, ExercisePresetConfig>> = {
  easy: {
    minNote: { name: "F", octave: 3, accidental: null },
    maxNote: { name: "C", octave: 5, accidental: null },
    timer: 60,
    allowedAccidentals: null,
    accidentalChance: null
  },
  medium: {
    minNote: { name: "C", octave: 3, accidental: null },
    maxNote: { name: "G", octave: 5, accidental: null },
    timer: 60,
    allowedAccidentals: ["#"],
    accidentalChance: 0.20
  },
  hard: {
    minNote: { name: "F", octave: 2, accidental: null },
    maxNote: { name: "C", octave: 6, accidental: null },
    timer: 60,
    allowedAccidentals: ["#", "b"],
    accidentalChance: 0.20
  },
}

export class SightreadingExercise {
  score = $state(0);
  playedNote: string = $state("");
  private isGameOver = $state(false);
  private currentNote: Note = { name: "C", octave: 4, accidental: null };
  private timer: TimerComponent | null;
  private correctNotesPlayed: number = 0;
  private totalNotesPlayed: number = $state(0);
  private staffRenderer: SingleStaffRenderer | null = null;

  private minSemitone: number;
  private maxSemitone: number;

  private staffClefType: string;
  private currentExerciseParam: ExercisePresetConfig;

  constructor(difficulty: string, clef: string) {
    let exercisePresetParam = exercisePresetParams[difficulty as difficulty];
    if (!exercisePresetParam) exercisePresetParam = exercisePresetParams.easy;
    this.currentExerciseParam = exercisePresetParam as ExercisePresetConfig;
    this.staffClefType = clef;

    this.minSemitone = noteToAbsoluteSemitone(this.currentExerciseParam.minNote);
    this.maxSemitone = noteToAbsoluteSemitone(this.currentExerciseParam.maxNote);

    this.currentNote = this.generateNewNote();
    this.timer = new TimerComponent(this.currentExerciseParam.timer, this.handleTimeout);
    this.timer.start();
  }

  private handleDrawNoteOnStaff(note: Note) {
    if (!this.staffRenderer) return;
    this.staffRenderer.clearAllNotes();

    let staffIndex = 0;
    if (this.staffClefType === "grand") {
      if (noteToAbsoluteSemitone(note) < 48) {
        staffIndex = 1;
      }
    }

    this.staffRenderer.createNoteOnStaff({
      note: { name: note.name, octave: note.octave!, accidental: note.accidental },
      staffGroupIndex: staffIndex
    });
  }

  setRenderer(renderer: SingleStaffRenderer) {
    if (this.staffRenderer) return;
    this.staffRenderer = renderer;
    this.handleDrawNoteOnStaff(this.currentNote);
  }

  handleMidiInput = (message: MidiMessage) => {
    if (this.isGameOver) return;
    if (message.type === "noteOn" && message.attackType === "single") {
      this.handleNoteInput(message.notes[0]);
    }
    else if (message.attackType === "chord") {
      this.handleIncorrectNote();
    }
  }

  handleNoteInput = (note: Note) => {
    if (this.isGameOver) return;
    const str = noteToString(note);
    this.playedNote = str;
    const tempCurrentNote = { ...this.currentNote };

    if (!note.octave) {
      tempCurrentNote.octave = null;
    }

    if (noteToAbsoluteSemitone(note) === noteToAbsoluteSemitone(tempCurrentNote)) this.handleCorrectNote(note);
    else this.handleIncorrectNote();
  }

  handleTimeout = () => {
    this.isGameOver = true;
    console.log("GAME OVER");
  }

  handleCorrectNote(note: Note) {
    if (!note.octave) note.octave = this.currentNote.octave;
    pianoAudioService.playNote(note);

    this.totalNotesPlayed += 1;
    this.correctNotesPlayed += 1;

    const newNote = this.generateNewNote();
    this.currentNote = newNote;

  }

  handleIncorrectNote() {
    this.totalNotesPlayed += 1;

    sfxAudioService.play("wrong");
  }

  destroy() {
    if (!this.timer) return;
    this.timer.stop();
    this.timer = null;
    this.staffRenderer = null;
  }

  get timeLeftString(): string {
    if (!this.timer) return "";
    const str = this.timer.formatTime();
    return str;
  }

  get correctNotesPlayedString(): string {
    return `${this.correctNotesPlayed} / ${this.totalNotesPlayed}`;
  }

  get currentNoteString(): string {
    return noteToString(this.currentNote);
  }

  generateNewNote(): Note {
    const lastNoteSemitone = noteToAbsoluteSemitone(this.currentNote);

    const randomSemitone = Math.floor(Math.random() * (this.maxSemitone - this.minSemitone + 1)) + this.minSemitone;
    let newSemitone = randomSemitone;

    if (randomSemitone === lastNoteSemitone) {
      newSemitone += 4;
      if (newSemitone > this.maxSemitone) newSemitone = this.minSemitone + newSemitone - this.maxSemitone;
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