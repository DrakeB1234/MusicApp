export type GlyphEntry = {
    path: string;
    yOffset?: number;
    xOffset?: number;
};
export declare const glyphPaths: {
    trebleClef: string;
    bassClef: string;
    flat: string;
    sharp: string;
    natural: string;
    wholeNote: string;
    upHalfNote: string;
    downHalfNote: string;
    upQuarterNote: string;
    downQuarterNote: string;
};
export declare const glyphs: Record<string, GlyphEntry>;
