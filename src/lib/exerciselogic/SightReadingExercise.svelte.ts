import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import { noteToString, type Note } from "$lib/helpers/notehelpers";
import { type MidiMessage } from "$lib/midiservice/midiService.svelte";
import { TimerComponent } from "./TimerComponent.svelte";

type SightreadingClefParams = {
  minOctave: Note;
  maxOctave: Note;
}

const sightreadingParams = {
  easy: {
    minOctave: { name: "F", octave: 3, accidental: null },
    maxOctave: { name: "C", octave: 5, accidental: null }
  } as SightreadingClefParams
}

export class SightreadingExercise {
  score = $state(0);
  playedNote: string = $state("");
  private isGameOver = $state(false);
  private currentNote: Note;
  private timer: TimerComponent | null;
  private correctNotesPlayed: number = 0;
  private totalNotesPlayed: number = $state(0);
  private clefParams: SightreadingClefParams;

  constructor(timeLimit: number, difficulty: string) {
    this.currentNote = { name: "C", octave: 4, accidental: null };
    this.timer = new TimerComponent(timeLimit, this.handleTimeout);
    this.timer.start();

    if (difficulty === "easy") {
      this.clefParams = sightreadingParams[difficulty];
    }
    else {
      this.clefParams = sightreadingParams.easy;
    }
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
    this.totalNotesPlayed += 1;
    this.correctNotesPlayed += 1;

    if (!note.octave) note.octave = 4;
    pianoAudioService.playNote(note);
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
}