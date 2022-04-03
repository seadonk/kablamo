import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import {
  ArtPatternFn,
  clearCanvas,
  DrawResult,
  eulerSpirals,
  getRadians,
  Preset,
  setUpCanvas,
  setupPanAndZoom,
  trackTransforms
} from "@kablamo/drawing";

@Component({
  selector: 'kablamo-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas') canvasElementRef!: ElementRef<HTMLCanvasElement>;

  // private _theta = 0.1;
  private _inputs: Preset = {};
  private drawResult: DrawResult | undefined;
  private initialized = false;
  private playInterval: number | undefined;

  // @Input() iterations = 10000;
  // @Input() scale = 1.5;
  @Input() drawFn: ArtPatternFn = eulerSpirals;

  get theta(): number {
    return this.inputs.theta;
  }

  get radians(): number {
    return getRadians(this.inputs.theta);
  }

  get iterations(): number {
    return this.inputs.iterations;
  }

  get scale(): number {
    return this.inputs.scale;
  }

  @Input()
  get inputs(): Preset {
    return this._inputs;
  }

  set inputs(value: Preset) {
    this._inputs = value;
  }

  setInputs = (value: Partial<Preset>) => {
    for (const key in value) {
      this.inputs[key] = value[key];
    }
  }

  public get playing(): boolean {
    return !!this.playInterval;
  }

  get canvas(): HTMLCanvasElement {
    const {nativeElement: canvas} = this.canvasElementRef || {};
    return canvas;
  }

  get ctx(): CanvasRenderingContext2D | null {
    return this.canvas.getContext('2d');
  }

  constructor(private cd: ChangeDetectorRef) {

  }

  update = () => this.ngOnChanges();

  ngAfterViewInit() {
    this.initialize();
    window.addEventListener('resize', () => this.initialize());
  }

  ngOnChanges() {
    if (this.canvas && this.ctx) {
      this.redraw(this.ctx);
    }
  }

  initialize = async () => {
    setUpCanvas(this.canvas);

    if (this.ctx) {
      if (!this.initialized) {
        trackTransforms(this.ctx);
        setupPanAndZoom(this.ctx, this.redraw);
        this.initialized = true;
      }
      await this.redraw(this.ctx);
    }
  }

  stop = () => {
    clearInterval(this.playInterval);
    this.playInterval = undefined;
  }

  play = () => {
    this.drawResult = undefined;
    this.playInterval = setInterval(async () => {
      if (this.inputs.stopOnCircle && this.drawResult && !this.drawResult?.touchedBorder) {
        this.stop();
      } else {
        this.setInputs({theta: this.inputs.theta + 0.0001});
      }
      this.ngOnChanges();
    });
  }

  redraw = async (ctx: CanvasRenderingContext2D) => {
    clearCanvas(ctx);
    this.drawResult = await this.drawFn(ctx, this.inputs, this.play) || undefined;
    this.cd.detectChanges();
  }
}
