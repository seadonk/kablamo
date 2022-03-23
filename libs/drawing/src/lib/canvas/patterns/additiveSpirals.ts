import {
    ArtPatternFn,
    checkIfContained,
    Coord,
    draw,
    DrawResult,
    getCanvasCenter,
    getRadialMove,
    Preset
} from "@kablamo/drawing";

export const additiveSpirals: ArtPatternFn = async (ctx: CanvasRenderingContext2D, preset: Preset): Promise<DrawResult> => {
  const {
    iterations,
    scale,
    theta
  } = preset;
  const result: DrawResult = {touchedBorder: false};
  draw(ctx, () => {
    let position: Coord = getCanvasCenter(ctx.canvas);
    for (let i = 0; i < iterations; i++) {
      position = getRadialMove(position, scale, i + (i % 2 ? 1 : -1) * (i * theta * i));
      checkIfContained(result, position, ctx);
      ctx.lineTo(...position);
    }
  });
  return result;
}
