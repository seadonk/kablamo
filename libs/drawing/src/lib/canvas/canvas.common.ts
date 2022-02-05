import {drawEulerSpirals, drawGrid, drawRectangles, drawSerpinski, drawSerpinski2} from "./canvas.patterns";

export type ArtPatternFn = (ctx: CanvasRenderingContext2D, ...rest: any[]) => void;

export const ArtModeMap: { [index: string]: ArtPatternFn } = {
  'eulerSpirals': drawEulerSpirals,
  'grid': drawGrid,
  'rectangles': drawRectangles,
  'serpinskiTurtle': drawSerpinski,
  'serpinskiTurtle2': drawSerpinski2
}
export type ArtMode = keyof typeof ArtModeMap;
export const ArtModes = Object.keys(ArtModeMap);

