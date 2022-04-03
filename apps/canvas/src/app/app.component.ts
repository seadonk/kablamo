import {Component, ViewChild} from '@angular/core';
import {
    ArtMode,
    ArtModeMap,
    ArtModes,
    ArtPatternFn,
    getPresets,
    getRadians,
    NamedPreset,
    Preset,
} from "@kablamo/drawing";
import {CanvasComponent} from "./components/canvas/canvas.component";

@Component({
    selector: 'kablamo-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    @ViewChild('canvasRef') canvasComponent: CanvasComponent;
    title = 'canvas';
    selectedAlgorithm: ArtMode;
    algorithms = ArtModes;
    play = false;
    selectedNamedPreset: NamedPreset | undefined;
    selectedPresetKeys: (keyof Preset)[];
    selectedPreset: Preset;
    drawFn: ArtPatternFn;
    model: Preset = {};
    inputs: Preset = {};
    presets: NamedPreset[];

    radians = getRadians;

    constructor() {
        this.changeMode('eulerSpirals');
    }

    changeMode = (mode: ArtMode) => {
        this.selectedAlgorithm = mode;
        this.presets = getPresets(this.selectedAlgorithm);
        this.selectedNamedPreset = this.presets[0];
        this.drawFn = ArtModeMap[mode];

        this.onPresetChange();
    }

    onPresetChange = () => {
        const {selectedNamedPreset} = this;
        for (const key in selectedNamedPreset) {
            if (this[key]) {
                this[key] = (selectedNamedPreset[key] ?? this[key]) as any;
            }
        }
        this.selectedPresetKeys = Object.keys(this.selectedNamedPreset?.preset) as (keyof Preset)[];
        this.selectedPreset = this.selectedNamedPreset.preset;

        this.setModel({...selectedNamedPreset.preset}, true);

        this.updateCanvas();
    }

    setModel = (value: Partial<Preset>, clear = false) => {
        if (clear) {
            this.model = {};
        }
        this.model = {...this.model, ...value};
        // keep inputs separate since the theta is in different units
        this.inputs = {...this.model};
        const {theta} = this.inputs;
        if (theta) {
            this.inputs.theta = getRadians(theta);
        }
    }

    onChange(key: any, value: any, index?: number) {
        if (index != null) {
            const result = [...this.model[key]];
            result[index] = +value;
            this.setModel({[key]: result});
        } else {
            this.setModel({[key]: +value});
        }
        this.updateCanvas();
    }

    updateCanvas() {
        this.canvasComponent?.update();
    }

    getStep(key: keyof Preset) {
        switch (key) {
            case 'theta':
                return 0.0001;
            default:
                return 1;
        }
    }

    getMaxInput(key: keyof Preset) {
        switch (key) {
            case 'iterations':
                return 100000;
            case 'theta':
                return 360;
            default:
                return 100;
        }
    }

    keyType = (key: keyof Preset): string => this.selectedPreset && typeof this.selectedPreset[key];
}

