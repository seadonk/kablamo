export const deepCopy = (o: any) => JSON.parse(JSON.stringify(o));

/** shuffles an array using the Fisher–Yates method
 * @see {@link https://bost.ocks.org/mike/shuffle/}
 * */
export function shuffle(array: any[]) {
  let m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export const stopWatch = (callback: any) => {
  const start = performance.now();
  callback();
  const end = performance.now();
  console.log(`Finished in ${end - start} ms`);
}

/** returns an array of numbers from 0 to N */
export const getRange = (n: number) => Array.from(Array(n + 1).keys());

/** returns true if the sets have the exact same values */
export const areSetsEqual = (a: Set<any>, b: Set<any>) => a.size === b.size && a.size === (new Set([...a, ...b]).size);
