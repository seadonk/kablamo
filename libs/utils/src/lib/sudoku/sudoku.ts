import {_, easyPreset} from "./sudoku.examples";

export type SudokuValue = number;
export type SudokuSet = SudokuValue[];
export type SudokuBoard = SudokuSet[];

export const printRow = (row: SudokuSet): string => {
  const separator = (index: number) => (index < 8 && (index + 1) % 3 === 0) ? '|' : '';
  const printCell = (value: SudokuValue) => value || ' ';
  const result = row?.map((cell, i) => printCell(cell) + separator(i)).join('');
  return `${result}`.split('').join(' ');
}

export const printBoard = (board: SudokuBoard): string => {
  const separator = (index: number) => ((index < 8 && (index + 1) % 3 === 0) ? `--- --- ---` + '\n' : '').split('').join(' ');
  return board?.map((row, i) => printRow(row) + '\n' + separator(i)).join('') + '';
}

export const logBoard = (board: SudokuBoard) => console.log(printBoard(board));

export const initBoard = (): SudokuBoard => getRange(8).map(() => getRange(8).map(() => _));

export const randomizeBoard = (board: SudokuBoard) => {
  const randValue = () => Math.floor(Math.random() * 9) + 1;
  board.forEach(row => row.forEach((cell, i) => row[i] = randValue()));
}

// validation
/** transposing the board will provide columns */
export const transpose = (board: SudokuBoard): SudokuBoard =>
  board[0].map((_, i) => board.map(row => row[i]));

/** validates a given row, box, or column of 9 values */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isSetUnique = (set: any[]): boolean => {
  const original = set.filter(v => v); // remove nulls
  return original.length === new Set(original).size;
}

/** returns an array of numbers from 0 to N */
export const getRange = (n: number) => Array.from(Array(n + 1).keys());

/** returns all 3x3 regions of the board */
export const getRegions = (board: SudokuBoard): SudokuSet[] => {
  const regionIndexes = getRange(2).flatMap(t => getRange(2).map(o => [t, o]));
  return regionIndexes.map(([r, c]) => board.slice(r * 3, r * 3 + 3).flatMap(t => t.slice(c * 3, c * 3 + 3)));
}

export const isBoardValid = (board: SudokuBoard): boolean => {
  const rows = board;
  const columns = transpose(board);
  const regions = getRegions(board);
  return ![...rows, ...columns, ...regions].some(set => !isSetUnique(set));
}

export const getNextOpenSquare = (board: SudokuBoard): { r: number, c: number } | undefined => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!board[r][c])
        return {r, c}
    }
  }
  return undefined;
}

export const isBoardComplete = (board: SudokuBoard): boolean => !board.some(row => !row.some(cell => !cell));

// solving
/** returns true when a solution is found or false if none; */
export const solve = (b: SudokuBoard): boolean => {
  const nextOpenCell = getNextOpenSquare(b);
  if (nextOpenCell) {
    const {r, c} = nextOpenCell;
    for (let v = 1; v < 10; v++) { // try all numbers in open cell
      // only make valid moves
      b[r][c] = v;
      if (isBoardValid(b)) { // check if move was possible
        // console.log(`set ${r},${c} tp ${v}`)
        if (solve(b))
          return true;
      }
      b[r][c] = _; // backtrack if not valid
    }
    return false;
  }
  return true; // no more open cells, solved;
}

export const stopWatch = (callback: any) => {
  const start = performance.now();
  callback();
  const end = performance.now();
  console.log(`Finished in ${end - start} ms`);
}

// demo node code
const board: SudokuBoard = easyPreset;
logBoard(board);
console.log(`Board Is ${isBoardValid(board) ? 'Valid' : 'Invalid'}`);
console.log();
stopWatch(() => {
  const solved = solve(board);
  if (solved) {
    console.log('Solved!');
    logBoard(board);
  } else {
    console.log('No Solutions!');
  }
});
// const solvedBoard = solveBoard(board);
// if (solvedBoard) {
//   logBoard(solvedBoard);
//   console.log(`Board Is ${isBoardValid(board) ? 'Valid' : 'Invalid'}`);
// } else {
//   console.log('Board is not solve-able');
// }

