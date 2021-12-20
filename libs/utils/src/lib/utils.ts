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
