import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import { absoluteSemitoneToNote, noteToAbsoluteSemitone, noteToString, type Note } from "$lib/helpers/notehelpers";
import { type MidiMessage } from "$lib/midiservice/midiService.svelte";
import { TimerComponent } from "./TimerComponent.svelte";

type difficulty = "easy" | "medium" | "hard";
type clefs = "treble" | "bass" | "grand";

export type ExercisePresetConfig = {
  minNote: Note;
  maxNote: Note;
  timer: number;
  allowedAccidentals: string[] | null;
}

export const exercisePresetParams: Partial<Record<difficulty, ExercisePresetConfig>> = {
  easy: {
    minNote: { name: "F", octave: 3, accidental: null },
    maxNote: { name: "C", octave: 5, accidental: null },
    timer: 60,
    allowedAccidentals: ["#", "b"]
  }
}

export class SightreadingExercise {
  score = $state(0);
  playedNote: string = $state("");
  private isGameOver = $state(false);
  private currentNote: Note;
  private timer: TimerComponent | null;
  private correctNotesPlayed: number = 0;
  private totalNotesPlayed: number = $state(0);

  private currentExerciseParam: ExercisePresetConfig;

  constructor(difficulty: string, clef: string) {
    let exercisePresetParam = exercisePresetParams[difficulty as difficulty];
    if (!exercisePresetParam) exercisePresetParam = exercisePresetParams.easy;
    this.currentExerciseParam = exercisePresetParam as ExercisePresetConfig;

    this.currentNote = { name: "C", octave: 4, accidental: null };
    this.timer = new TimerComponent(this.currentExerciseParam.timer, this.handleTimeout);
    this.timer.start();
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

    // If no octave, don't consider it for correct note checking
    if (!note.octave) {
      if (note.name === this.currentNote.name && note.accidental === this.currentNote.accidental) this.handleCorrectNote(note);
      else this.handleIncorrectNote();
    }
    else {
      if (note.name === this.currentNote.name && note.accidental === this.currentNote.accidental && note.octave === this.currentNote.octave) this.handleCorrectNote(note);
      else this.handleIncorrectNote();
    }
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
    const tempMaxSemitone = noteToAbsoluteSemitone(this.currentExerciseParam.maxNote);
    const tempMinSemitone = noteToAbsoluteSemitone(this.currentExerciseParam.minNote);
    const lastNoteSemitone = noteToAbsoluteSemitone(this.currentNote);

    // Handle edgecase of min > max, or the inverse
    const minSemitone = Math.min(tempMinSemitone, tempMaxSemitone);
    const maxSemitone = Math.max(tempMinSemitone, tempMaxSemitone);

    const randomSemitone = Math.floor(Math.random() * (maxSemitone - minSemitone + 1)) + minSemitone;
    let newSemitone = randomSemitone;

    if (newSemitone === lastNoteSemitone) {
      newSemitone += 4;
      if (newSemitone > maxSemitone) {
        newSemitone = minSemitone + 4;
      }
    }

    return absoluteSemitoneToNote(newSemitone);
  }
}