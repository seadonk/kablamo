import {_, easyPresetInvalidRegion} from "./sudoku.examples";

export type SudokuValue = number | string;
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

// demo node code
const board = easyPresetInvalidRegion;
logBoard(board);
console.log(`Board Is ${isBoardValid(board) ? 'Valid' : 'Invalid'}`);

