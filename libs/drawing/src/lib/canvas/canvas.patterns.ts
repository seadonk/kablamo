import {Coord, draw, getCanvasCenter, getRadialMove} from "./canvas.utils";
import {ArtPatternFn} from "./canvas.common";

export interface DrawResult {
  touchedBorder?: boolean
}

export const spirograph: ArtPatternFn = async (ctx: CanvasRenderingContext2D, theta: number, iterations: number, scale: number): Promise<DrawResult> => {
  const radii: number[] = [60, 40];
  const thetas: number[] = [1, 4, 10 ];
  const numDiscs = radii.length;
  const center: Coord = getCanvasCenter(ctx.canvas);
  const result: DrawResult = {touchedBorder: false};
  ctx.moveTo(...center);
  draw(ctx, () => {
    const positions: Coord[] = [];
    for (let i = 0; i < iterations; i++) {
      for(let n = 0; n < numDiscs; n++){
        const prevPosition: Coord = [...(!n ? center : positions[n-1])];
        positions[n] = getRadialMove(prevPosition, scale * radii[n], thetas[n] * i);
      }
      const position = positions[positions.length - 1];
      checkIfContained(result, position, ctx);
      ctx.lineTo(...position);
    }
  }, false);
  return result;
}

export const additiveSpirals: ArtPatternFn = async (ctx: CanvasRenderingContext2D, theta: number, iterations: number, scale: number): Promise<DrawResult> => {
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


export const drawEulerSpirals: ArtPatternFn = async (ctx: CanvasRenderingContext2D, theta: number, iterations: number, scale: number): Promise<DrawResult> => {
  const result: DrawResult = {touchedBorder: false};
  draw(ctx, () => {
    let position: Coord = getCanvasCenter(ctx.canvas);
    for (let i = 0; i < iterations; i++) {
      position = getRadialMove(position, scale, i * i * theta);
      checkIfContained(result, position, ctx);
      ctx.lineTo(...position);
    }
  });
  return result;
}


/** Latches the result.touchedBorder if the drawing touches or exceeds the canvas */
function checkIfContained(result: DrawResult, position: [number, number], ctx: CanvasRenderingContext2D) {
  if (!result.touchedBorder) {
    const [x, y] = position;
    if (x <= 0 || y <= 0 || x >= ctx.canvas.width || y >= ctx.canvas.height) {
      result.touchedBorder = true;
    }
  }
}

export const drawEulerSpirals2: ArtPatternFn = async (ctx: CanvasRenderingContext2D, theta: number, iterations: number, scale: number): Promise<DrawResult> => {
  const result: DrawResult = {touchedBorder: false};
  draw(ctx, () => {
    let position: Coord = getCanvasCenter(ctx.canvas);
    for (let i = 0; i < iterations; i++) {
      position = getRadialMove(position, scale, (i % 2 ? 1 : -1) * i * i * theta);
      checkIfContained(result, position, ctx);
      ctx.lineTo(...position);
    }
  });
  return result;
}

export const drawGrid: ArtPatternFn = (ctx: CanvasRenderingContext2D) => {
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

export const drawRectangles: ArtPatternFn = (ctx: CanvasRenderingContext2D) => {
  draw(ctx, () => {
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 150, 100);


    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(10, 10, 50, 50);

    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fillRect(30, 30, 50, 50);
  });
}

export const drawSerpinski: ArtPatternFn = (ctx: CanvasRenderingContext2D, theta: number = 60 * 2 * Math.PI / 360, iterations = 12, scale = 1) => {
  draw(ctx, () => {
    type Step = 'X' | 'Y' | '+' | '-';
    const A: Step[] = ['Y', '+', 'X', '+', 'Y'];
    const B: Step[] = ['X', '-', 'Y', '-', 'X'];
    const stepMap: { [index: string]: Step[] } = {
      'X': A,
      'Y': B,
      '+': ['+'],
      '-': ['-']
    };
    type Round = Step[];
    let currentRound: Round = ['X'];
    let position: Coord = [0, 0];//getCanvasCenter(ctx.draw-canvas);
    let heading = 0;
    const getNextRound = (lastRound: Round): Round => {
      const result: Round = [];
      lastRound.forEach(step => result.push(...stepMap[step]));
      return result;
    };
    const performStep = (step: Step) => {
      const isGroup = step === 'X' || step === 'Y';
      if (isGroup) return;
      // turn right or left
      heading = step === '+' ? heading + theta : heading - theta;
      // move
      position = getRadialMove(position, scale, heading);
      ctx.lineTo(...position);
    };
    const performRound = (round: Round) => round.forEach(step => performStep(step));
    let i = 0;
    while (i < iterations) {
      performRound(currentRound);
      currentRound = getNextRound(currentRound);
      i++;
    }
  }, false)
}

export const drawSerpinski2: ArtPatternFn = (ctx: CanvasRenderingContext2D, theta: number = 60 * 2 * Math.PI / 360, iterations = 12, scale = 1) => {
  draw(ctx, () => {
    type Step = 'X' | 'Y' | '+' | '-';
    const A: Step[] = ['Y', '+', 'X', '+', 'Y', '+', 'X'];
    const B: Step[] = ['-', 'X', '-'];
    const stepMap: { [index: string]: Step[] } = {
      'X': A,
      'Y': B,
      '+': ['+'],
      '-': ['-']
    };
    type Round = Step[];
    let currentRound: Round = ['Y'];
    let position: Coord = getCanvasCenter(ctx.canvas);
    let heading = 0;
    const getNextRound = (lastRound: Round): Round => {
      const result: Round = [];
      scale = scale + 1;
      lastRound.forEach(step => result.push(...stepMap[step]));
      return result;
    };
    const performStep = (step: Step) => {
      const isGroup = step === 'X' || step === 'Y';
      if (isGroup) return;
      // turn right or left
      heading = step === '+' ? heading + theta : heading - theta;
      // move
      position = getRadialMove(position, scale, heading);
      ctx.lineTo(...position);
    };
    const performRound = (round: Round) => round.forEach(step => performStep(step));
    let i = 0;
    while (i < iterations) {
      performRound(currentRound);
      currentRound = getNextRound(currentRound);
      i++;
    }
  }, false)
}

