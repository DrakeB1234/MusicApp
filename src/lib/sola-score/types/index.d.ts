export type NaturalNoteNames = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Accidentals = "#" | "b" | "n";
export type NoteDurations = "w" | "h" | "q";
export type Note = {
    name: string;
    octave: number;
    accidental: string | null;
    duration?: string;
};
