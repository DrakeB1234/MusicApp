import { absoluteSemitoneToNote, noteToAbsoluteSemitone, type Note } from "./notehelpers";

export const CHORD_QUALITIES: Record<string, number[]> = {
  //Triads
  "maj": [0, 4, 7],
  "min": [0, 3, 7],
  "dim": [0, 3, 6],
  "aug": [0, 4, 8],
  "sus4": [0, 5, 7],
  "sus2": [0, 2, 7],

  // 6th Chords
  "maj6": [0, 4, 7, 9],
  "min6": [0, 3, 7, 9],
  "6/9": [0, 4, 7, 9, 14],

  // 7th Chords
  "7": [0, 4, 7, 10], // Dominant
  "maj7": [0, 4, 7, 11],
  "min7": [0, 3, 7, 10],
  "dim7": [0, 3, 6, 9],
  "min7b5": [0, 3, 6, 10], // Half Dim

  // 9th Chords
  "9": [0, 4, 7, 10, 14],
  "maj9": [0, 4, 7, 11, 14],
  "min9": [0, 3, 7, 10, 14],
  "min9b5": [0, 3, 6, 10, 14],

  // Extensions
  "add9": [0, 4, 7, 14],
  "minadd9": [0, 3, 7, 14]
};

const REGEX_CHORD_STRING = /^(?<root>[a-gA-G])(?<accidental>[b#]?)(?<quality>\w*)$/

export function chordStringToNotes(chordName: string, rootOctave: number = 4): Note[] {
  const match = chordName.match(REGEX_CHORD_STRING);

  if (!match || !match.groups) {
    throw new Error(`Invalid chord string: ${chordName}`);
  }

  const [_, root, accidental, quality] = match;


  const intervals = CHORD_QUALITIES[quality];

  if (!intervals) {
    throw new Error(`Unknown chord quality: ${quality}`);
  }

  const rootNote: Note = {
    name: root,
    octave: rootOctave,
    accidental: accidental || null
  };

  const rootSemitone = noteToAbsoluteSemitone(rootNote);

  return intervals.map(interval => {
    const note = absoluteSemitoneToNote(rootSemitone + interval);
    return note;
  });
};

export function notesToChordString(notes: Note[]): string | null {
  if (notes.length === 0) return null;

  const rootNote = notes[0];
  const rootSemitone = noteToAbsoluteSemitone(rootNote);

  const currentIntervals = notes.map(n => {
    const semitone = noteToAbsoluteSemitone(n);
    let diff = semitone - rootSemitone;
    return diff;
  }).sort((a, b) => a - b);

  for (const [quality, signature] of Object.entries(CHORD_QUALITIES)) {
    if (JSON.stringify(signature) === JSON.stringify(currentIntervals)) {
      const acc = rootNote.accidental ? rootNote.accidental : "";
      return `${rootNote.name}${acc}${quality}`;
    }
  }

  const normalizedInput = [...new Set(currentIntervals.map(i => i % 12).sort((a, b) => a - b))];

  for (const [quality, signature] of Object.entries(CHORD_QUALITIES)) {
    const normalizedSig = [...new Set(signature.map(i => i % 12).sort((a, b) => a - b))];

    if (JSON.stringify(normalizedSig) === JSON.stringify(normalizedInput)) {
      const acc = rootNote.accidental ? rootNote.accidental : "";
      return `${rootNote.name}${acc}${quality}`;
    }
  }

  return null;
}