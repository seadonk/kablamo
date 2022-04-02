import {ArtPatternFn, Coord, draw, Preset} from "@kablamo/drawing";

export const serpinskiDots: ArtPatternFn = (ctx: CanvasRenderingContext2D, preset: Preset) => {
    const {iterations = 100, scale = 1} = preset;

    const getVertices = (scale: number, ctx: CanvasRenderingContext2D) => {
        const padding = 20;
        const [width, height] = [ctx.canvas.width,ctx.canvas.height];
        const a = [0+padding,height-padding];
        const b = [width/2, 0+padding];
        const c = [width-padding, height-padding];
        return [a,b,c].map(t => t.map(c => c*scale) as Coord);
    }

    const vertices: Coord[] = getVertices(scale, ctx);
    draw(ctx, () => {
        const getRandVertex = (): Coord => vertices[Math.floor(Math.random() * 3)];
        const getMidPoint = (a: Coord, b: Coord): Coord => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        const drawPoint = ([x,y]: Coord) => ctx.fillRect(x,y,1,1);
        const drawVertices = () => vertices.forEach(t => drawPoint(t));

        let position: Coord = vertices[0];
        drawVertices();
        for (let i = 0; i < iterations; i++) {
            const vertex = getRandVertex();
            position = getMidPoint(position, vertex);
            drawPoint(position);
        }
    });
}
