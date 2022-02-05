import {AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild} from '@angular/core';
import {ArtPatternFn, clearCanvas, drawEulerSpirals, setUpCanvas} from "@kablamo/drawing";

@Component({
  selector: 'kablamo-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas') canvasElementRef!: ElementRef<HTMLCanvasElement>;

  @Input() theta = 0.1;
  @Input() iterations = 10000;
  @Input() scale = 1.5;
  @Input() drawFn: ArtPatternFn = drawEulerSpirals;
  @Input() play = false;
  private initialized = false;

  ngAfterViewInit() {
    this.initialize();
  }

  ngOnChanges() {
    if (this.canvasElementRef) {
      const {nativeElement: canvas} = this.canvasElementRef;
      const ctx = canvas && canvas.getContext && canvas.getContext('2d');
      if (ctx) {
        this.redraw(ctx);
      }
    }
  }

  initialize = async () => {
    const {nativeElement: canvas} = this.canvasElementRef;
    setUpCanvas(canvas);

    const ctx = canvas && canvas.getContext && canvas.getContext('2d');

    if (ctx) {
      if (!this.initialized) {
        // trackTransforms(ctx);
        // setupPanAndZoom(ctx, () => this.redraw(ctx));
        this.initialized = true;
      }
      await this.redraw(ctx);
    }
  }

  redraw = async (ctx: CanvasRenderingContext2D) => {
    clearCanvas(ctx);
    this.drawFn(ctx, this.theta, this.iterations, this.scale, this.play);
  }
}
