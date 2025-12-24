import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import { absoluteSemitoneToNote, clampToNaturalSemitone, noteToAbsoluteSemitone, noteToVectorScoreString, type Note } from "$lib/helpers/notehelpers";
import { type MidiMessage } from "$lib/midiservice/midiService.svelte";
import { ScrollingStaff } from "vector-score";
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
  generatedNotesAmount: number;
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
    generatedNotesAmount: 25,
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
    generatedNotesAmount: 35,
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
    generatedNotesAmount: 40,
    allowedAccidentals: ["#", "b"],
    accidentalChance: 0.30
  },
}

export class SightReadingExercise {
  private staffRendererInstance: ScrollingStaff | null = null;

  private minSemitone: number;
  private maxSemitone: number;
  private notesQueue: Note[] = [];
  private currentNoteIndex: number = 0;
  private currentExerciseParam: ExercisePresetConfig;
  private currentNote: Note = { name: "C", octave: 4, accidental: null };

  // UI State (variables that will be accessed outside of this class, so getters are made to ensure only instance can change these)
  private _score = $state(0);
  private _isGameOver = $state(false);
  private correctNotesPlayed: number = 0;
  private totalNotesPlayed: number = $state(0);

  get score(): number { return this._score };
  get isGameOver(): boolean { return this._isGameOver };
  get correctAndTotalNotes(): string {
    return `${this.correctNotesPlayed} / ${this.totalNotesPlayed}`;
  }

  constructor(difficulty: string, clef: string) {
    let exercisePresetParam = exercisePresetParams[difficulty as difficulty];
    if (!exercisePresetParam) exercisePresetParam = exercisePresetParams.easy;
    this.currentExerciseParam = exercisePresetParam as ExercisePresetConfig;

    this.minSemitone = noteToAbsoluteSemitone(this.currentExerciseParam.noteRanges[clef].min);
    this.maxSemitone = noteToAbsoluteSemitone(this.currentExerciseParam.noteRanges[clef].max);

    this.generateNotesQueue(this.currentExerciseParam.generatedNotesAmount);

    // Set initial target
    if (this.notesQueue.length > 0) {
      this.currentNote = this.notesQueue[0];
    }
  }

  private generateNotesQueue(count: number) {
    for (let i = 0; i < count; i++) {
      this.notesQueue.push(this.generateRandomNote());
    }
  }

  private generateRandomNote(): Note {
    // Get the last note, remove the accidental, then get semitone to compare to random one, if duplicate fix.
    let randomSemitone = Math.floor(Math.random() * (this.maxSemitone - this.minSemitone + 1)) + this.minSemitone;
    randomSemitone = clampToNaturalSemitone(randomSemitone);
    const prevSemitone = noteToAbsoluteSemitone({
      ...this.currentNote,
      accidental: null
    });

    if (prevSemitone === randomSemitone) {
      randomSemitone = Math.floor(Math.random() * (this.maxSemitone - this.minSemitone + 1)) + this.minSemitone;
      randomSemitone = clampToNaturalSemitone(randomSemitone);
    };

    let note = absoluteSemitoneToNote(randomSemitone);

    if (this.currentExerciseParam.accidentalChance && Math.random() < this.currentExerciseParam.accidentalChance) {
      if (this.currentExerciseParam.allowedAccidentals) {
        const randomAccidentalIdx = Math.floor(Math.random() * this.currentExerciseParam.allowedAccidentals.length);
        note.accidental = this.currentExerciseParam.allowedAccidentals[randomAccidentalIdx];
      };
    };

    // Set this note as current, for helping duplicate notes at start of this block
    this.currentNote = note;
    return note;
  };

  private handleCorrectNote(note: Note) {
    if (!note.octave) note.octave = this.currentNote.octave;
    pianoAudioService.playNote(note);
    this.staffRendererInstance?.advanceNotes();

    this.totalNotesPlayed += 1;
    this.correctNotesPlayed += 1;

    this.currentNoteIndex++;
    if (this.currentNoteIndex >= this.notesQueue.length) {
      this._isGameOver = true;
    }
    else {
      this.currentNote = this.notesQueue[this.currentNoteIndex];
    }
  }

  private handleIncorrectNote(note: Note) {
    this.totalNotesPlayed += 1;

    sfxAudioService.play("wrong");
  }

  setRenderer(renderer: ScrollingStaff) {
    if (this.staffRendererInstance) return;
    this.staffRendererInstance = renderer;

    let vectorNoteStrings: string[] = [];
    this.notesQueue.forEach(note => {
      vectorNoteStrings.push(noteToVectorScoreString(note));
    });

    this.staffRendererInstance.queueNotes(vectorNoteStrings);
  }

  // Starts the game by starting the timer, input handlers and handleTimeout handle the game logic
  startGameLoop() {

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
    this.staffRendererInstance?.destroy();
    this.staffRendererInstance = null;
  }
}