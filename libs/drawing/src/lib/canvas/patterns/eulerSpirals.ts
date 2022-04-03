import {Preset} from "../canvas.presets";
import {Coord, draw, getCanvasCenter, getRadialMove} from "../canvas.utils";
import {ArtPatternFn, checkIfContained, DrawResult} from "../canvas.common";


export const eulerSpirals: ArtPatternFn = async (ctx: CanvasRenderingContext2D,
                                                 preset: Preset): Promise<DrawResult> => {
    const {
        iterations,
        scale,
        theta,
        useColors
    } = preset;
    const result: DrawResult = {touchedBorder: false};
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    const max = parseInt('999999', 16);
    const getColor = (i: number): string => {
        const pct = i / iterations;
        const result = '#' + (Math.floor(pct * max)).toString(16);
        return result;
    }
    const drawSegment = (start: Coord, end: Coord, iteration: number) => {
        if (useColors) {
            ctx.beginPath(); // in order to set a color we need to begin a path
            ctx.moveTo(...start); // new paths require a starting position
            ctx.strokeStyle = getColor(iteration);
            ctx.lineTo(...end);
            ctx.stroke();
        } else {
            ctx.lineTo(...end);
        }
    };

    draw(ctx, () => {
        let position: Coord = getCanvasCenter(ctx.canvas);
        let prevPosition: Coord = position;
        for (let i = 0; i < iterations; i++) {
            position = getRadialMove(position, scale, i * i * theta);
            checkIfContained(result, position, ctx);
            drawSegment(position, prevPosition, i);
            prevPosition = position;
        }
    });
    return result;
}
