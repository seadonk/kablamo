import {ArtMode} from "./canvas.common";

export type Preset = {
    // currently presets are in degrees, but we should change this
    theta?: number,
    iterations?: number,
    value?: string,
    stopOnCircle?: boolean,
    scale?: number
} | any;

export interface NamedPreset {
    name: string,
    preset: Preset
}

export const DefaultPreset: Partial<Preset> = {
    iterations: 50000,
    scale: 5
}

export const getPresets = (artMode: ArtMode): NamedPreset[] => {
    const modePresets = (presets[artMode] || {});
    return Object.keys(modePresets).map(key => {
        const value = modePresets[key]; // some presets are simply a number representing theta
        const artModeDefault = modePresets['default'];
        const _preset = {...DefaultPreset, ...artModeDefault, ...(value instanceof Object ? value : {theta: value})};
        return {name: key, preset: _preset};
    });
}

const presets: { [index: ArtMode]: { [index: string]: Preset | number } } = {
    rectangles: {
        default: {
            scale: 1
        }
    },
    serpinskiDots: {
        default: {
            iterations: 50000,
            scale: 1,
            numSides: 3,
            theta: 0
        },
        sebbenPentagon: {
            iterations: 1000000,
            numSides: 5
        },
        sebbenSnowflake: {
            iterations: 1000000,
            numSides: 6
        }
    },
    serpinskiTurtle: {
        default: {
            theta: 64.14066,
            iterations: 12
        }
    },
    serpinskiTurtle2: {
        default: {
            theta: 59.07692,
            iterations: 12
        }
    },
    eulerSpirals: {
        default: {
            theta: 1.4433,
            iterations: 100000,
            useColors: true,
            stopOnCircle: true
        },
        theDot: 154.10072,
        doubleLobe: 154.10437,
        fuzzyEye: 54.10251,
        thickNuerons: 54.10381,
        fuzzyEye2: 54.12208,
        fuzzySpiral: 54.12588,
        seaUrchin: 54.13456,
        almost: 54.14277,
        spark: 54.15236,
        covid: 54.16254,
        mindsEye: 54.14277,
        starfish: 54.14433,
        heart: 54.19217000000164,
        tinyDot: 54.21687000000246,
        elegant: 179.69222000000036,
        peacock: 179.71842000000123,
        octopus: 51.11170000000039,
        clef: 51.424000000000795
    },
    additiveSpirals: {
        doiley: {
            theta: 37.03125000000251,
            iterations: 27490,
            stopOnCircle: true
        },
        amoeba: {
            theta: 37.054650000003285,
            iterations: 44260
        }
    },
    eulerSpirals2: {
        default: {
            stopOnCircle: true
        },
        yinYangSin: {
            theta: 194.97345,
            iterations: 5000
        }
    },
    spirograph: {
        default: {
            radii: [60, 60],
            thetas: [1, 2],
            iterations: 10000
        },
        life: {
            iterations: 3540,
            scale: 75,
            radii: "51", // these need to be strings for some reason
            thetas: "26"
        },
        celtic: {
            iterations: 781,
            scale: 18,
            radii: [10, 20],
            thetas: [-1, 2]
        },
        janetSpecial: {
            radii: [60, 40],
            thetas: [1, 4, 10],
            iterations: 10000
            //      ` const radii: number[] = [60, 40];
            // const thetas: number[] = [1, 4, 10 ];
            // const numDiscs = radii.length;
            // const center: Coord = getCanvasCenter(ctx.canvas);
            // const result: DrawResult = {touchedBorder: false};
            // ctx.moveTo(...center);
            // draw(ctx, () => {
            //   const positions: Coord[] = [];
            //   for (let i = 0; i < iterations; i++) {
            //     for(let n = 0; n < numDiscs; n++){
            //       const prevPosition: Coord = [...(!n ? center : positions[n-1])];
            //       positions[n] = getRadialMove(prevPosition, scale * radii[n], thetas[n] * i);
            //     }
            //     const position = positions[positions.length - 1];
            //     checkIfContained(result, position, ctx);
            //     ctx.lineTo(...position);
            //   }
            // }, false);
            // return result;`
        }
    }
}
