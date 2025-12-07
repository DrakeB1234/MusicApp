export type Note = {
  name: string,
  octave: number | null,
  accidental: string | null,
  duration?: string
}

export const NATURAL_NOTE_NAMES = ["C", "D", "E", "F", "G", "A", "B"];
export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function midiSemitoneToNote(semitone: number): Note {
  // MIDI maps C4 = 60, which should be 48
  const newSemitone = semitone - 12;
  const newNote = absoluteSemitoneToNote(newSemitone);
  return newNote;
}

export function absoluteSemitoneToNote(semitone: number): Note {
  const note = NOTE_NAMES[semitone % 12];
  const octave = Math.floor(semitone / 12);
  console.log(semitone, note, octave)

  let name = "";
  let accidental = null;

  if (note.includes("#")) {
    name = note.charAt(0);
    accidental = "#";
  } else {
    name = note;
  }

  return {
    name: name,
    octave: octave,
    accidental: accidental
  };
}

export function getNaturalNoteIndex(noteName: string): number {
  return NATURAL_NOTE_NAMES.findIndex(e => e === noteName);
}

export function noteToAbsoluteSemitone(note: Note): number {
  const nameIdx = getNaturalNoteIndex(note.name);
  const octaveNum = (note.octave ?? 0) * 12;
  let semitones = nameIdx + octaveNum;

  if (note.accidental === "#") semitones += 1;
  else if (note.accidental === "b") semitones -= 1;
  return semitones;
}

export function noteToString(note: Note): string {
  let str = `${note.name}${note.accidental ?? ''}`;
  if (note.octave) str += `/${note.octave}`;
  if (note.duration) str += `/${note.duration}`;
  return str;
}