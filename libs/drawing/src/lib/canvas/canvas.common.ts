import {
  additiveSpirals,
  drawEulerSpirals,
  drawEulerSpirals2,
  drawGrid,
  drawRectangles,
  DrawResult,
  drawSerpinski,
  drawSerpinski2,
  spirograph
} from "./canvas.patterns";

export type ArtPatternFn = (ctx: CanvasRenderingContext2D, ...rest: any[]) => Promise<DrawResult> | void;

export const ArtModeMap: { [index: string]: ArtPatternFn } = {
  'eulerSpirals': drawEulerSpirals,
  'eulerSpirals2': drawEulerSpirals2,
  'grid': drawGrid,
  'rectangles': drawRectangles,
  'serpinskiTurtle': drawSerpinski,
  'serpinskiTurtle2': drawSerpinski2,
  additiveSpirals,
  spirograph
}
export type ArtMode = keyof typeof ArtModeMap;
export const ArtModes = Object.keys(ArtModeMap);

export const getRadians = (degrees: number) => degrees / 360 * 2 * Math.PI;
export const getDegrees = (radians: number) => radians * 360 / 2 / Math.PI;
