import {ArtPatternFn, draw, getCanvasCenter} from "@kablamo/drawing";

export const grid: ArtPatternFn = (ctx: CanvasRenderingContext2D) => {
  draw(ctx, () => {
    const centerOffset = getCanvasCenter(ctx.canvas);
    // draw y axis
    ctx.moveTo(0, centerOffset[1]);
    ctx.lineTo(ctx.canvas.width, centerOffset[1]);

    // draw x axis
    ctx.moveTo(centerOffset[0], 0);
    ctx.lineTo(centerOffset[0], ctx.canvas.height);
  });
}
