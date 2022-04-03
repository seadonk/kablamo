import {ArtPatternFn, Coord, draw, getCanvasCenter, getRadialMove, Preset} from "@kablamo/drawing";

export const serpinskiDots: ArtPatternFn = (ctx: CanvasRenderingContext2D, preset: Preset) => {
    const {iterations = 100, scale = 1, numSides = 3, theta: startingTheta = 0} = preset;

    const getMidPoint = (a: Coord, b: Coord): Coord => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const drawPoint = ([x, y]: Coord) => ctx.fillRect(x, y, 1, 1);
    const getRandVertex = (vertices: Coord[]): Coord => vertices[Math.floor(Math.random() * numSides)];
    const drawVertices = (vertices: Coord[]) => vertices.forEach(t => drawPoint(t));
    // gets the vertices for an n-sides shape, centered in the canvas
    const getVertices = (scale: number, numSides: number, ctx: CanvasRenderingContext2D, padding = 20) => {
        const [width, height] = [ctx.canvas.width, ctx.canvas.height];
        const center = getCanvasCenter(ctx.canvas);
        const theta = 2 * Math.PI / numSides;
        const results = [];
        const radius = height / 2 - padding;
        for (let n = 0; n < numSides; n++) {
            const vertex = getRadialMove(center, radius, n * theta + startingTheta);
            results.push(vertex);
        }
        return results.map(t => t.map(c => c * scale) as Coord);
    }

    draw(ctx, () => {
        const vertices: Coord[] = getVertices(scale, numSides, ctx);
        let position: Coord = vertices[0];
        drawVertices(vertices);
        for (let i = 0; i < iterations; i++) {
            const vertex = getRandVertex(vertices);
            position = getMidPoint(position, vertex);
            drawPoint(position);
        }
    });
}
