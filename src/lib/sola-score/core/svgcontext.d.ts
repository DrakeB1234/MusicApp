export interface SVGLineOptions {
    parent?: SVGElement;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
}
export interface SVGPathOptions {
    parent?: SVGElement;
    translateX?: number;
    translateY?: number;
    scale?: number;
    fill?: string;
}
export interface SVGContextOptions {
    scale?: number;
    backgroundColor?: string;
}
export declare class SVGContext {
    private svg;
    private scale;
    constructor(containerIdOutput: HTMLElement, options: SVGContextOptions);
    get element(): SVGElement;
    resize(width: number, height: number): void;
    createGroup(className: string, parent?: SVGElement): SVGGElement;
    line(x1: number, y1: number, x2: number, y2: number, options?: SVGLineOptions): void;
    path(d: string, options?: SVGPathOptions): void;
}
