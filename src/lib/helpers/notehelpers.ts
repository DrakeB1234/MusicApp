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

const REGEX_NOTE_STRING = /(?<name>[a-gA-G])(?<accidental>[#b]?)(?<octave>[0-9])/;

export function midiSemitoneToNote(semitone: number): Note {
  // MIDI maps C4 = 60, which should be 48
  const newSemitone = semitone - 12;
  const newNote = absoluteSemitoneToNote(newSemitone);
  return newNote;
}

export function absoluteSemitoneToNote(semitone: number, preferFlats: boolean = false): Note {
  const octave = Math.floor(semitone / 12);
  const noteSemitoneDifference = Math.floor(semitone % 12);

  // Try to find a natural note first (e.g., C, D, E)
  let nameOffset = Object.entries(NATURAL_NOTE_SEMITONE_OFFSETS).find(e => e[1] === noteSemitoneDifference);
  let accidental: string | null = null;
  let noteName: string;

  if (nameOffset) {
    // If it's a natural note (white key), just return it
    noteName = nameOffset[0];
  } else {
    if (preferFlats) {
      const targetNatural = noteSemitoneDifference + 1;

      // Handle the wrap-around case (e.g. searching for C above B)
      nameOffset = Object.entries(NATURAL_NOTE_SEMITONE_OFFSETS).find(e => e[1] === targetNatural);

      if (nameOffset) {
        noteName = nameOffset[0];
        accidental = "b";
      } else {
        const targetNaturalBelow = noteSemitoneDifference - 1;
        nameOffset = Object.entries(NATURAL_NOTE_SEMITONE_OFFSETS).find(e => e[1] === targetNaturalBelow)!;
        noteName = nameOffset[0];
        accidental = "#";
      }

    } else {
      const targetNatural = noteSemitoneDifference - 1;
      nameOffset = Object.entries(NATURAL_NOTE_SEMITONE_OFFSETS).find(e => e[1] === targetNatural)!;
      noteName = nameOffset[0];
      accidental = "#";
    }
  }

  return {
    name: noteName,
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
  if (note.accidental === "#") accidentalOffset = 1;
  if (note.accidental === "b") accidentalOffset = -1;

  return nameOffset + octaveOffset + accidentalOffset;
}

export function noteToString(note: Note): string {
  let str = `${note.name}${note.accidental ?? ''}`;
  if (note.octave) str += `/${note.octave}`;
  if (note.duration) str += `/${note.duration}`;
  return str;
}

export function noteToVectorScoreString(note: Note): string {
  let str = note.name;

  str += note.accidental ?? "";
  str += note.octave ?? "0";
  str += note.duration ?? "w";

  return str
}

export function stringToNote(note: string): Note | null {
  const match = note.match(REGEX_NOTE_STRING);

  if (!match || !match.groups) {
    return null;
  }

  const { _, name, accidental, octave } = match.groups;

  return {
    name: name,
    accidental: accidental ?? null,
    octave: Number(octave)
  };
}

export function rhythmStringToVectorScoreData(notes: string[]): string[][] {
  if (notes.length === 0) return [];

  // Group consecutive identical notes, regardless of value q's together, e's together...
  const rawGroups: string[][] = [];
  let currentBatch: string[] = [notes[0]];

  for (let i = 1; i < notes.length; i++) {
    if (notes[i] === notes[i - 1]) {
      currentBatch.push(notes[i]);
    } else {
      rawGroups.push(currentBatch);
      currentBatch = [notes[i]];
    }
  }
  rawGroups.push(currentBatch);

  // Merge non-beam groups, if isBeam push accumulated notes into result, then push beam. Accumlation only occurs to non-beam groups
  // which are defined as any group that is not 'e' and less than 1 in size. (qqq) = not beam (e) = not beam (ee) = beam
  const result: string[][] = [];
  let accumulation: string[] = [];

  for (const group of rawGroups) {
    const isBeam = group[0] === 'e' && group.length > 1;

    if (isBeam) {
      if (accumulation.length > 0) {
        result.push(accumulation);
        accumulation = [];
      }
      result.push(group);
    } else {
      accumulation.push(...group);
    }
  }

  if (accumulation.length > 0) {
    result.push(accumulation);
  }

  return result;
}