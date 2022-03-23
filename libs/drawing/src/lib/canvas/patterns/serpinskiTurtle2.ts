import {ArtPatternFn, Coord, draw, getCanvasCenter, getRadialMove, Preset} from "@kablamo/drawing";

export const serpinskiTurtle2: ArtPatternFn = (ctx: CanvasRenderingContext2D, preset: Preset) => {
  let {
    // eslint-disable-next-line prefer-const
    iterations = 12,
    scale = 1,
    // eslint-disable-next-line prefer-const
    theta = 60 * 2 * Math.PI / 360
  } = preset;
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
