import {ArtPatternFn, draw, Preset} from "@kablamo/drawing";

export const rectangles: ArtPatternFn = (ctx: CanvasRenderingContext2D, preset: Preset) => {
  const {scale} = preset;
  draw(ctx, () => {
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 150 * scale, 100 * scale);


    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(10, 10, 50 * scale, 50 * scale);

    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fillRect(30, 30, 50 * scale, 50 * scale);
  });
}
