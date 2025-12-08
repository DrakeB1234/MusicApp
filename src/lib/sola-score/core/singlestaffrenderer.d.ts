import { Note } from '../types';
import { SVGContext } from './svgcontext';
export interface SingleStaffRendererOptions {
    staffType: StaffGroupTypes;
    width?: number;
    spacesAbove?: number;
    spacesBelow?: number;
}
type StaffGroupTypes = "treble" | "bass" | "grand";
export type CreateNotesOnStaffEntry = {
    note: Note;
    staffGroupIndex?: number;
    flipNote?: boolean;
};
export declare class SingleStaffRenderer {
    private ctx;
    private width;
    private staffGroupParent;
    private staffElements;
    constructor(ctx: SVGContext, options?: SingleStaffRendererOptions);
    private setStaffHeight;
    private handleCreateGrandStaff;
    private handleCreateSingleStaff;
    private namespaceScopedQuerySelector;
    private drawStaffClef;
    private drawStaffLines;
    private drawStaff;
    private drawGrandStaffConnectors;
    private getStaffElementByIndex;
    private applyTranslateToNoteGroup;
    private drawGlyph;
    private getNoteSpacingYByReferenceNote;
    private drawNote;
    private drawNoteAccidental;
    private drawNoteLedgerLines;
    private drawNoteHandler;
    createNotesOnStaff(entries: CreateNotesOnStaffEntry[]): void;
    createNoteOnStaff(entry: CreateNotesOnStaffEntry): void;
    clearAllNotes(): void;
    justifyNotes(): void;
}
export {};
