import {_} from "./sudoku.examples";
import {deepCopy} from "../utils";

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

/** true if all sets of cells are unique within their respective rows, columns, and square regions */
export const isValid = (board: SudokuBoard): boolean => {
  const rows = board;
  const columns = transpose(board);
  const regions = getRegions(board);
  return ![...rows, ...columns, ...regions].some(set => !isSetUnique(set));
}

/** returns true if there are no empty cells */
export const isComplete = (board: SudokuBoard): boolean => !board.flatMap(t => t).some(cell => !cell);

/** returns true if the board is valid and complete */
export const isSolved = (board: SudokuBoard): boolean => isComplete(board) && isValid(board);

// solving
export const getNextOpenCell = (board: SudokuBoard): { r: number, c: number } | undefined => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!board[r][c])
        return {r, c}
    }
  }
  return undefined;
}

/** returns true when a solution is found or false if none;
 * This function is faster than solveAll because it stops when
 * it finds the first solution. */
export const solve = (board: SudokuBoard): boolean => {
  const nextOpenCell = getNextOpenCell(board);
  if (nextOpenCell) {
    const {r, c} = nextOpenCell;
    for (let v = 1; v < 10; v++) { // try all numbers in open cell
      // only make valid moves
      board[r][c] = v;
      if (isValid(board)) { // check if move was possible
        if (solve(board))
          return true;
      }
      board[r][c] = _; // backtrack if not valid
    }
    return false;
  }
  return true; // no more open cells, solved;
}

/** returns an array of all possible solutions to the given board */
export const solveAll = (board: SudokuBoard): SudokuBoard[] => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!board[r][c]) { // cell is empty
        const solutions: SudokuBoard[] = [];
        for (let v = 1; v < 10; v++) {
          board[r][c] = v; // try all numbers in open cell
          if (isValid(board)) {
            solutions.push(...solveAll(board));
          }
          board[r][c] = _; // backtrack if not valid
        }
        return solutions; // exhausted all numbers, return to caller
      }
    }
  }
  return isSolved(board) ? [deepCopy(board)] : []; // deep copy board so it doesn't mutate when looking for more solutions
}

/** generates a solveable board with the given number of clues.
 * board is not guaranteed to have a unique solution */
export const generateBoard = (clues: number): SudokuBoard => {
  const genBoard = (board: SudokuBoard, clues: number): boolean => {
    if (getFilledCells(board) < clues) {
      const nextOpenCell = getNextOpenCell(board); // determine next cell
      if (nextOpenCell) {
        const {r, c} = nextOpenCell;
        for (let v = 1; v < 10; v++) { // try all numbers in open cell
          // only make valid moves
          board[r][c] = v;
          if (isValid(board)) { // check if move was possible
            if(genBoard(board, clues))
              return true;
          }
          board[r][c] = _; // backtrack if not valid
        }
        return false;
      }
    }
    return true;
  }

  const board = initBoard();
  genBoard(board, clues);
  return board;
  // whileLoop:
  //   while (getFilledCells(board) < clues) {
  //     const nextOpenCell = getNextOpenCell(board);
  //     if (nextOpenCell) {
  //       console.log(nextOpenCell);
  //       const {r, c} = nextOpenCell;
  //       for (let v = 1; v <= 9; v++) {
  //         board[r][c] = v;
  //         if (isValid(board))
  //           continue whileLoop;
  //       }
  //     }
  //     break;
  //   }
  // return board;
}


/** returns true if all filled cells from the source are contained in the target */
export const isSubsetOf = (source: SudokuBoard, target: SudokuBoard) => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (source[r][c] && source[r][c] !== target[r][c])
        return false;
    }
  }
  return true;
}

/** returns the number of filled cells in a board */
export const getFilledCells = (board: SudokuBoard): number => board.flatMap(t => t).filter(t => t).length;

/** returns the number of cells in a board */
export const getSize = (board: SudokuBoard): number => board.length * board[0].length;

export const analyzeBoard = (board: SudokuBoard) => {
  const filledCells = getFilledCells(board);
  const completeRegions = getRegions(board).filter(t => isSetUnique(t)).length;
  const completeColumns = transpose(board).filter(t => isSetUnique(t)).length;
  const completeRows = board.filter(t => isSetUnique(t)).length;
  const regions = getRegions(board).length;
  const rows = board.length;
  const columns = transpose(board).length;
  const cells = board.flatMap(t => t).length;
  console.log(`${filledCells}/${cells} - Filled Cells`);
  console.log(`${completeRegions}/${regions} - Complete Regions`);
  console.log(`${completeColumns}/${columns} - Complete Columns`);
  console.log(`${completeRows}/${rows} - Complete Rows`);

  const solutions = solveAll(board);
  console.log('Solutions: ', solutions.length);
  solutions.forEach((t, i) => {
    console.log();
    console.log(`Solution ${i + 1}`);
    logBoard(t)
  });
}

export const stopWatch = (callback: any) => {
  const start = performance.now();
  callback();
  const end = performance.now();
  console.log(`Finished in ${end - start} ms`);
}

export const logBoard = (board: SudokuBoard) => console.log(printBoard(board));
export const logStatus = (board: SudokuBoard) => {
  logBoard(board);

  // console.log('isComplete', isComplete(board));
  // console.log('isValid', isValid(board));
  // console.log('isSolved', isSolved(board));
  // analyzeBoard(board);
  console.log();
}

