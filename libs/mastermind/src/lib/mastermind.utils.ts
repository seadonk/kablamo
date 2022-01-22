// import {shuffle} from "@kablamo/utils";

export const Colors = {
  red: '',
  blue: '',
  green: '',
  yellow: '',
  black: '',
  white: '',
}

export type Code = keyof typeof Colors;
export type Codes = Code[];
const keyMap = {
  /** correct in color and position */
  'exact': 'black',
  /** correct in color only */
  'partial': 'white',
  /** incorrect */
  'none': undefined
}
export type Key = keyof typeof keyMap | undefined;
export type Keys = Key[];
export type Board = (Codes | undefined)[];

/** returns true if all positions exactly match */
export const isGuessCorrect = (secret: Codes, guess: Codes) => JSON.stringify(secret) === JSON.stringify(guess);

/** returns a shuffled array of keys for the given guess
 * Does not mutate secret or guess */
export const getKeysFromGuess = ([...secret]: Codes, [...guess]: Codes): Keys => {
  // find exact matches first before we mutate arrays which will lose the indexes
  const exact: Keys = [...guess]
    .map((t, i) => ({t, i})) // grab indexes
    .filter(t => t.t === secret[t.i]) // find exact matches
    .map(({t, i}) => {
      guess.splice(guess.indexOf(t), 1); // remove from guess
      secret.splice(secret.indexOf(t), 1); // remove from secret
      return "exact";
    });
  // for all remaining guess values, determine if partial match
  const rest: Keys = guess.map(g => {
    const match = secret.find(t => t === g); // pop guess and find a matching secret if any
    match && secret.splice(secret.indexOf(match), 1); // remove secret
    return match ? "partial" : "none";
  });
  return [...exact, ...rest];
  // can't connect to other libraries yet, need to figure out how to use this TS Only library with the others, which are ang libs
  // return shuffle([...exact, ...partial, ...none]);
};

