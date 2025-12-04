import type { SightreadingClefParams } from "$lib/data/sightreadingParams";

export type Note = {
  name: string,
  octave: number | null,
  accidental: string | null,
  duration?: string
}

const SEMITONE_NOTE_MAP: Omit<Note, "octave" | "duration">[] = [
  { name: "C", accidental: null },
  { name: "C", accidental: "#" },
  { name: "D", accidental: null },
  { name: "D", accidental: "#" },
  { name: "E", accidental: null },
  { name: "F", accidental: null },
  { name: "F", accidental: "#" },
  { name: "G", accidental: null },
  { name: "G", accidental: "#" },
  { name: "A", accidental: null },
  { name: "A", accidental: "#" },
  { name: "B", accidental: null }
];
export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const NOTE_TO_INDEX: Record<string, number> = {};
NOTE_NAMES.forEach((n, i) => NOTE_TO_INDEX[n] = i);

/**
 * Converts a Semitone/MIDI number to a Note obj.
 * Example: 60 -> "C4", 61 -> "C#4"
 */
export function absoluteSemitoneToNote(midiNum: number): Note {
  const note = SEMITONE_NOTE_MAP[midiNum % 12];
  const octave = Math.floor(midiNum / 12) - 1;

  return {
    octave: octave,
    ...note
  };
}

export function noteToString(note: Note): string {
  let str = `${note.name}${note.accidental ?? ''}`;
  if (note.octave) str += `/${note.octave}`;
  if (note.duration) str += `/${note.duration}`;
  return str;
}

export function generateNewNote(note: Note, lastNote: Note, clefParams: SightreadingClefParams) {

}