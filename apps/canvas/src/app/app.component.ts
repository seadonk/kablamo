import {Component} from '@angular/core';
import {ArtMode, ArtModeMap, ArtModes, ArtPatternFn} from "@kablamo/drawing";

@Component({
  selector: 'kablamo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'canvas';
  theta = 1.4433;
  iterations = 100000;
  scale = 5;
  selectedMode: ArtMode = 'eulerSpirals';
  modes = ArtModes;
  play = false;
  drawFn: ArtPatternFn = ArtModeMap[this.selectedMode];

  getRadians = (degrees: number) => degrees / 360 * 2 * Math.PI;

  constructor() {
    this.changeMode('serpinskiTurtle2');


    setInterval(() => {
      if (this.play) {
        this.theta = this.theta + 0.1
      }
    });
  }

  changeMode = (mode: ArtMode) => {
    this.selectedMode = mode;
    if (this.selectedMode === 'serpinskiTurtle') {
      this.theta = 64.14066;
      this.iterations = 12;
    }
    if (this.selectedMode === 'serpinskiTurtle2') {
      this.theta = 59.07692;
      this.iterations = 12;
    }
    if (this.selectedMode === 'eulerSpirals') {
      this.theta = 1.4433;
      this.iterations = 50000;
    }
    this.drawFn = ArtModeMap[mode];
  }
}

