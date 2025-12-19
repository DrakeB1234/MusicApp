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

// 12th semitone is for getting the 8th degree C4 -> C5
export const SCALE_INTERVALS: Record<string, number[]> = {
  "Major": [0, 2, 4, 5, 7, 9, 11, 12],
  "Minor": [0, 2, 3, 5, 7, 8, 10, 12],
  "Lydian": [0, 2, 4, 6, 7, 9, 11, 12],
  "Mixolydian": [0, 2, 4, 5, 7, 9, 10, 12],
  "Dorian": [0, 2, 3, 5, 7, 9, 10, 12],
  "Phrygian": [0, 1, 3, 5, 7, 8, 10, 12],
  "Locrian": [0, 1, 3, 5, 6, 8, 10, 12],
};

// Note corresponds to the amount of sharps (+) or flats (-) in the given key
const CIRCLE_OF_FIFTHS_POS: Record<string, number> = {
  "C": 0,
  "G": 1, "D": 2, "A": 3, "E": 4, "B": 5, "F#": 6, "C#": 7,
  "F": -1, "Bb": -2, "Eb": -3, "Ab": -4, "Db": -5, "Gb": -6, "Cb": -7
};

const REGEX_CHORD_STRING = /^(?<root>[a-gA-G])(?<accidental>[b#]?)(?<quality>\w*)$/;

// Intervals
export const INTERVAL_DISTANCES: Record<string, number> = {
  "m2": 1,
  "M2": 2,
  "m3": 3,
  "M3": 4,
  "P4": 5,
  "A4": 6,
  "d5": 6,
  "P5": 7,
  "m6": 8,
  "M6": 9,
  "m7": 10,
  "M7": 11,
  "P8": 12
};

function getPreferFlatsByEnharmonicPreference(root: string, quality: string): boolean {
  // Get circle position (default to 0 if unknown)
  // This is determining the amount of sharps / flats in a key
  // Look at a circle of fifths for reference
  const circlePos = CIRCLE_OF_FIFTHS_POS[root] ?? 0;

  const isMinorLike = quality.includes("min") || quality.includes("dim");
  const harmonicScore = circlePos + (isMinorLike ? -3 : 0);

  const preferFlats = harmonicScore < 0;

  return preferFlats;
}

export function chordStringToNotes(chordName: string, rootOctave: number = 4): Note[] {
  const match = chordName.match(REGEX_CHORD_STRING);
  if (!match || !match.groups) throw new Error(`Invalid chord string: ${chordName}`);

  const [_, root, accidentalRaw, quality] = match;
  const accidental = accidentalRaw || "";

  const preferFlats = getPreferFlatsByEnharmonicPreference(root + accidental, quality);

  const intervals = CHORD_QUALITIES[quality];
  if (!intervals) throw new Error(`Unknown chord quality: ${quality}`);

  const rootNote: Note = {
    name: root,
    octave: rootOctave,
    accidental: accidental || null
  };

  const rootSemitone = noteToAbsoluteSemitone(rootNote);

  return intervals.map(interval => {
    return absoluteSemitoneToNote(rootSemitone + interval, preferFlats);
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

export function getScaleNotes(root: string, scaleType: string, rootOctave: number = 4): Note[] {
  const intervals = SCALE_INTERVALS[scaleType];

  if (!intervals || !scaleType) {
    throw new Error(`Unknown scale type: ${scaleType}`);
  }

  const preferFlats = getPreferFlatsByEnharmonicPreference(root, scaleType);

  const match = root.match(/^([a-gA-G])([b#]?)$/);
  if (!match) throw new Error(`Invalid root note: ${root}`);

  const [_, step, accidental] = match;
  const rootNote: Note = {
    name: step.toUpperCase(),
    octave: rootOctave,
    accidental: accidental || null,
  };

  const rootSemitone = noteToAbsoluteSemitone(rootNote);

  return intervals.map(interval => {
    return absoluteSemitoneToNote(rootSemitone + interval, preferFlats);
  });
}