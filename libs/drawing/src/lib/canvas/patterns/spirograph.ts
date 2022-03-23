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

export const spirograph: ArtPatternFn = async (ctx: CanvasRenderingContext2D,
                                               preset: Preset): Promise<DrawResult> => {
  const {
    radii = [60, 40],
    iterations = 10000,
    scale = 5,
    thetas = [1, 4, 10]
  } = preset;
  const numDiscs = radii.length;
  const center: Coord = getCanvasCenter(ctx.canvas);
  const result: DrawResult = {touchedBorder: false};
  ctx.moveTo(...center);
  draw(ctx, () => {
    const positions: Coord[] = [];
    for (let i = 0; i < iterations; i++) {
      for (let n = 0; n < numDiscs; n++) {
        const prevPosition: Coord = [...(!n ? center : positions[n - 1])];
        positions[n] = getRadialMove(prevPosition, scale * radii[n], thetas[n] * i);
      }
      const position = positions[positions.length - 1];
      checkIfContained(result, position, ctx);
      if (position) {
        ctx.lineTo(...position);
      }
    }
  }, false);
  return result;
}
