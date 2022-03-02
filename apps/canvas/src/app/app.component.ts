import {Component} from '@angular/core';
import {ArtMode, ArtModeMap, ArtModes, ArtPatternFn, getRadians, presets} from "@kablamo/drawing";

export interface AlgorithmPreset {
  name: string,
  theta: number,
  iterations?: number
}

@Component({
  selector: 'kablamo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'canvas';
  theta = 1.4433;

  get radians() {
    return getRadians(this.theta);
  }

  stopOnCircle = true;
  iterations = 100000;
  scale = 5;
  selectedAlgorithm: ArtMode = 'eulerSpirals';
  algorithms = ArtModes;
  play = false;
  selectedPreset: AlgorithmPreset | undefined;

  get presets(): AlgorithmPreset[] | undefined {
    const algorithmPresets = presets[this.selectedAlgorithm];
    if (!algorithmPresets) return undefined;
    return Object.keys(algorithmPresets).map(t => {
      const isTheta = !isNaN(algorithmPresets[t] as any);
      const theta = isTheta
        ? algorithmPresets[t] as number : (algorithmPresets[t] as any).theta;
      const iterations= !isTheta && (algorithmPresets[t] as any).iterations || undefined;

      return {
        name: t,
        theta: theta,
        iterations: iterations
      };
    });
  }

  drawFn: ArtPatternFn = ArtModeMap[this.selectedAlgorithm];

  changeMode = (mode: ArtMode) => {
    this.selectedAlgorithm = mode;
    if (this.selectedAlgorithm === 'serpinskiTurtle') {
      this.theta = 64.14066;
      this.iterations = 12;
    }
    if (this.selectedAlgorithm === 'serpinskiTurtle2') {
      this.theta = 59.07692;
      this.iterations = 12;
    }
    if (this.selectedAlgorithm === 'eulerSpirals') {
      this.theta = 1.4433;
      this.iterations = 50000;
    }
    this.drawFn = ArtModeMap[mode];
  }

  onPresetChange($event: Event) {
    this.theta = this.selectedPreset?.theta ?? this.theta;
    this.iterations = this.selectedPreset?.iterations ?? this.iterations;
  }
}

