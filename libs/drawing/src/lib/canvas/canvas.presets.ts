import {ArtMode} from "@kablamo/drawing";


export interface AlgorithmPreset {
  name: string,
  theta: number,
  iterations?: number
}

export const presets: { [index: ArtMode]: { [index: string]: number | { theta: number, iterations: number } } } = {
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
      iterations: 50000
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
      iterations: 27490
    },
    amoeba: {
      theta: 37.054650000003285,
      iterations: 44260
    }
  },
  eulerSpirals2: {
    yinYangSin: {
      theta: 194.97345,
      iterations: 5000
    }
  },
  spirograph: {
    default: {
      theta: 89.20354,
      iterations: 200
    }
  }
}
