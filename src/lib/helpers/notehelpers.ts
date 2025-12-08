export type Note = {
  name: string,
  octave: number | null,
  accidental: string | null,
  duration?: string
}

export const NATURAL_NOTE_NAMES = ["C", "D", "E", "F", "G", "A", "B"];
export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const NATURAL_NOTE_SEMITONE_OFFSETS: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11
};

export function midiSemitoneToNote(semitone: number): Note {
  // MIDI maps C4 = 60, which should be 48
  const newSemitone = semitone - 12;
  const newNote = absoluteSemitoneToNote(newSemitone);
  return newNote;
}

export function absoluteSemitoneToNote(semitone: number): Note {
  const octave = Math.floor(semitone / 12);
  const noteSemitoneDifference = Math.floor(semitone % 12);
  let accidental: string | null = null;
  let nameOffset = Object.entries(NATURAL_NOTE_SEMITONE_OFFSETS).find(e => e[1] === noteSemitoneDifference);

  if (nameOffset === undefined) {
    const accidentalSemitoneDifference = noteSemitoneDifference - 1;
    nameOffset = Object.entries(NATURAL_NOTE_SEMITONE_OFFSETS).find(e => e[1] === accidentalSemitoneDifference);
    accidental = "#";
  }

  return {
    name: nameOffset?.[0]!,
    octave: octave,
    accidental: accidental
  };
}

export function getNaturalNoteIndex(noteName: string): number {
  return NATURAL_NOTE_NAMES.findIndex(e => e === noteName);
}

export function noteToAbsoluteSemitone(note: Note): number {
  const nameOffset = NATURAL_NOTE_SEMITONE_OFFSETS[note.name.toUpperCase()];
  const octaveOffset = (note.octave ?? 0) * 12;
  let accidentalOffset = 0;
  if (note.accidental === "#") accidentalOffset += 1;
  if (note.accidental === "b") accidentalOffset -= 1;

  return nameOffset + octaveOffset + accidentalOffset;
}

export function noteToString(note: Note): string {
  let str = `${note.name}${note.accidental ?? ''}`;
  if (note.octave) str += `/${note.octave}`;
  if (note.duration) str += `/${note.duration}`;
  return str;
}