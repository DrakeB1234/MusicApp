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

export function rhythmStringToVectorScoreData(notes: string[]): string[][] {
  const result: string[][] = [];
  let currentGroup: string[] = [];
  let consecutiveEGroup: string[] = [];

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];

    if (note === 'e' && consecutiveEGroup.length < 4) {
      if (currentGroup.length > 0) {
        result.push(currentGroup);
        currentGroup = [];
      }

      consecutiveEGroup.push(note);

    } else {
      if (consecutiveEGroup.length > 0) {
        result.push(consecutiveEGroup);
        consecutiveEGroup = [];
      }

      currentGroup.push(note);
    }
  }

  if (consecutiveEGroup.length > 0) {
    result.push(consecutiveEGroup);
    consecutiveEGroup = [];
  } else if (currentGroup.length > 0) {
    result.push(currentGroup);
  }

  return result;
}