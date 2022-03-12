import {Component} from '@angular/core';
import {AlgorithmPreset, ArtMode, ArtModeMap, ArtModes, ArtPatternFn, getRadians, presets} from "@kablamo/drawing";

@Component({
  selector: 'kablamo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'canvas';
  theta = 1.4433;
  stopOnCircle = true;
  iterations = 100000;
  scale = 5;
  selectedAlgorithm: ArtMode;
  algorithms = ArtModes;
  play = false;
  selectedPreset: AlgorithmPreset | undefined;
  drawFn: ArtPatternFn;

  get radians() {
    return getRadians(this.theta);
  }

  get presets(): AlgorithmPreset[] | undefined {
    const algorithmPresets = presets[this.selectedAlgorithm];
    if (!algorithmPresets) return undefined;
    return Object.keys(algorithmPresets).map(t => {
      const isTheta = !isNaN(algorithmPresets[t] as any);
      const theta = isTheta
        ? algorithmPresets[t] as number : (algorithmPresets[t] as any).theta;
      const iterations = !isTheta && (algorithmPresets[t] as any).iterations || undefined;

      return {
        name: t,
        theta: theta,
        iterations: iterations
      };
    });
  }

  constructor(){
    this.changeMode('spirograph');
  }

  changeMode = (mode: ArtMode) => {
    this.selectedAlgorithm = mode;
    this.selectedPreset = this.presets && this.presets[0];
    this.onPresetChange();
    this.drawFn = ArtModeMap[mode];
  }

  onPresetChange() {
    const {selectedPreset} = this;
    for (const key in selectedPreset) {
      if (this[key]) {
        this[key] = (selectedPreset[key] ?? this[key]) as any;
      }
    }
  }
}

