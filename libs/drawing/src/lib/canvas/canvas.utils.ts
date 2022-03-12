export type Coord = [number, number];

export const clearCanvas = (ctx: CanvasRenderingContext2D) => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

export const getCanvasCenter = (canvas: HTMLCanvasElement): Coord => [canvas.width / 2, canvas.height / 2]

/** converts the raw position relative to the top left corner, to one relative to the center of the draw-canvas. */
export const fromCenter = (rawPosition: Coord, canvas: HTMLCanvasElement): Coord => offsetPosition(rawPosition, getCanvasCenter(canvas));

/** translates the position according to the offset */
export const offsetPosition = (position: Coord, offset: Coord): Coord => [position[0] + offset[0],
  offset[0] - position[1]]

export const setUpCanvas = (canvas: HTMLCanvasElement) => {
  // Feed the size back to the draw-canvas.
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
};


///

export function trackTransforms(ctx: CanvasRenderingContext2D) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  let xform: DOMMatrix = svg.createSVGMatrix();
  ctx.getTransform = function () {
    return xform;
  };

  const savedTransforms: DOMMatrix[] = [];
  const save = ctx.save;
  ctx.save = function () {
    savedTransforms.push(xform.translate(0, 0));
    return save.call(ctx);
  };
  const restore = ctx.restore;
  ctx.restore = function () {
    // @ts-ignore
    xform = savedTransforms.pop();
    return restore.call(ctx);
  };

  const scale = ctx.scale;
  ctx.scale = function (sx, sy) {
    xform = xform.scaleNonUniform(sx, sy);
    return scale.call(ctx, sx, sy);
  };
  const rotate = ctx.rotate;
  ctx.rotate = function (radians) {
    xform = xform.rotate(radians * 180 / Math.PI);
    return rotate.call(ctx, radians);
  };
  const translate = ctx.translate;
  ctx.translate = function (dx, dy) {
    xform = xform.translate(dx, dy);
    return translate.call(ctx, dx, dy);
  };
  const transform = ctx.transform;
  ctx.transform = function (a, b, c, d, e, f) {
    const m2 = svg.createSVGMatrix();
    m2.a = a;
    m2.b = b;
    m2.c = c;
    m2.d = d;
    m2.e = e;
    m2.f = f;
    xform = xform.multiply(m2);
    return transform.call(ctx, a, b, c, d, e, f);
  };
  const setTransform = ctx.setTransform;
  // @ts-ignore
  ctx.setTransform = function (a, b, c, d, e, f) {
    xform.a = a;
    xform.b = b;
    xform.c = c;
    xform.d = d;
    xform.e = e;
    xform.f = f;
    // @ts-ignore
    return setTransform.call(ctx, a, b, c, d, e, f);
  };
  const pt = svg.createSVGPoint();
  // @ts-ignore
  ctx.transformedPoint = function (x, y) {
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(xform.inverse());
  }
}

type Point = { x: number, y: number };

export const setupPanAndZoom = (ctx: CanvasRenderingContext2D, redraw: (...rest: any[]) => void) => {
  const {canvas} = ctx;

  let lastX = canvas.width / 2, lastY = canvas.height / 2;
  let dragStart: Point | null;
  let dragged: boolean;

  canvas.addEventListener('mousedown', function (evt) {
    // @ts-ignore
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
    // @ts-ignore
    dragStart = ctx.transformedPoint(lastX, lastY);
    dragged = false;
  }, false);

  canvas.addEventListener('mousemove', function (evt) {
    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
    dragged = true;
    if (dragStart) {
      // @ts-ignore
      const pt = ctx.transformedPoint(lastX, lastY);
      ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
      redraw(ctx);
    }
  }, false);
  canvas.addEventListener('mouseup', function (evt) {
    dragStart = null;
    if (!dragged) zoom(evt.shiftKey ? -1 : 1);
  }, false);

  const scaleFactor = 1.1;
  const zoom = function (clicks: number) {
    // @ts-ignore
    const pt = ctx.transformedPoint(lastX, lastY);
    ctx.translate(pt.x, pt.y);
    const factor = Math.pow(scaleFactor, clicks);
    ctx.scale(factor, factor);
    ctx.translate(-pt.x, -pt.y);
    redraw(ctx);
  }

  const handleScroll = function (evt: any) {
    const delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
    if (delta) zoom(delta);
    return evt.preventDefault() && false;
  };
  canvas.addEventListener('DOMMouseScroll', handleScroll, false);
  canvas.addEventListener('mousewheel', handleScroll, false);
}

/** calculates the new coordinates for a current position, moving a given distance at a given angle */
export const getRadialMove = (position: Coord, scale: number, theta: number): Coord => {
  const [x, y] = position;
  return [x + scale * Math.cos(theta), y + scale * Math.sin(theta)];
}

/** setsup a path, executes the actions, then draws the stroke */
export const draw = (ctx: CanvasRenderingContext2D, actions: (...rest: any[]) => void, center = true) => {
  ctx.beginPath();
  if (center) {
    ctx.moveTo(...getCanvasCenter(ctx.canvas));
  }
  actions();
  ctx.stroke();
}
