import {
  additiveSpirals,
  eulerSpirals,
  eulerSpirals2,
  grid,
  rectangles,
  serpinskiTurtle,
  serpinskiTurtle2,
  spirograph
} from "./patterns";
import {Preset} from "./canvas.presets";
import {serpinskiDots} from "./patterns/serpinskiDots";

export type ArtPatternFn = (ctx: CanvasRenderingContext2D, preset?: Preset, ...rest: any[]) => Promise<DrawResult> | void;

export const ArtModeMap: { [index: string]: ArtPatternFn } = {
  eulerSpirals,
  eulerSpirals2,
  grid,
  rectangles,
  serpinskiTurtle,
  serpinskiTurtle2,
  additiveSpirals,
  spirograph,
  serpinskiDots
}
export type ArtMode = keyof typeof ArtModeMap;
export const ArtModes = Object.keys(ArtModeMap);

export const getRadians = (degrees: number) => degrees / 360 * 2 * Math.PI;
export const getDegrees = (radians: number) => radians * 360 / 2 / Math.PI;

export interface DrawResult {
  touchedBorder?: boolean
}

/** Latches the result.touchedBorder if the drawing touches or exceeds the canvas */
export function checkIfContained(result: DrawResult, position: [number, number], ctx: CanvasRenderingContext2D) {
  if (position && !result.touchedBorder) {
    const [x, y] = position;
    if (x <= 0 || y <= 0 || x >= ctx.canvas.width || y >= ctx.canvas.height) {
      result.touchedBorder = true;
    }
  }
}
