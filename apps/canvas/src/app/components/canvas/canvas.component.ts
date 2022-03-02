import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import {
  ArtPatternFn,
  clearCanvas,
  drawEulerSpirals,
  DrawResult,
  getRadians,
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

  private _theta = 0.1;
  private radians: number = getRadians(this._theta);
  private drawResult: DrawResult | undefined;
  /** angle in degrees */
  @Input()
  get theta(): number{
    return this._theta;
  }
  set theta(value: number) {
    this._theta = value;
    this.radians = getRadians(value);
    this.thetaChange.emit(value);
  }
  @Input() iterations = 10000;
  @Input() scale = 1.5;
  @Input() drawFn: ArtPatternFn = drawEulerSpirals;
  @Input() stopOnCircle = true;
  @Output() thetaChange = new EventEmitter<number>();

  public get playing(): boolean { return !!this.playInterval; }

  private initialized = false;
  private playInterval: number | undefined;

  get canvas(): HTMLCanvasElement {
    const {nativeElement: canvas} = this.canvasElementRef || {};
    return canvas;
  }

  get ctx(): CanvasRenderingContext2D | null {
    return this.canvas.getContext('2d');
  }

  constructor(private cd: ChangeDetectorRef){

  }

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
      this.cd.detectChanges();
      if(this.stopOnCircle && this.drawResult && !this.drawResult?.touchedBorder){
        this.stop();
      } else {
        this.theta = this.theta + 0.0001;
      }
    });
  }

  redraw = async (ctx: CanvasRenderingContext2D) => {
    clearCanvas(ctx);
    this.drawResult = await this.drawFn(ctx, this.radians, this.iterations, this.scale, this.play) || undefined;
    this.cd.detectChanges();
  }
}
