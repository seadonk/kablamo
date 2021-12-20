import {_} from "./sudoku.examples";
import {deepCopy, shuffle} from "../utils";

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

/** returns true if a board has only one solution
 * This will return false faster than it will return true */
export const isUnique = (board: SudokuBoard): boolean => !!solveAll(board,2).length;

/** tests whether a board has any solutions */
export const isSolveable = (board: SudokuBoard): boolean => solve(deepCopy(board));

/** returns true if there are no empty cells */
export const isComplete = (board: SudokuBoard): boolean => !board.flatMap(t => t).some(cell => !cell);

/** returns true if the board is valid and complete */
export const isSolved = (board: SudokuBoard): boolean => isComplete(board) && isValid(board);

/** returns a unique identifier for the board */
export const hash = (board: SudokuBoard): string => board.flat().join('');

/** the zero based r,c coordinates of a cell */
export type CellPosition = { r: number, c: number };

// solving
/** finds the next empty cell.
 * The default order is left to right top to bottom sequentially.
 * A different order can be provided. */
export const getNextOpenCell = (board: SudokuBoard, cellOrder?: CellPosition[]): CellPosition | undefined =>
  (cellOrder ?? allCells()).find(({r, c}) => !board[r][c])

/** Solves a board in place
 * returns true when a solution is found or false if none;
 * This function is faster than solveAll because it stops when
 * it finds the first solution.
 * if random is true, it will attempt to solve the board using
 * random rather than sequential values. If there is more than one
 * solution random will result in different solutions, whereas not random
 * will always return the same solution.
 * */
export const solve = (board: SudokuBoard, random = false): boolean => {
  const nextOpenCell = getNextOpenCell(board);
  if (nextOpenCell) {
    const {r, c} = nextOpenCell;
    const values = (random ? getRange(8) : shuffle(getRange(8))).map(t => t+1);
    for(const v of values) { // try all numbers in open cell
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
export const solveAll = (board: SudokuBoard, maxSolutions?: number): SudokuBoard[] => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!board[r][c]) { // cell is empty
        const solutions: SudokuBoard[] = [];
        // instead of 1 - 9, get a shuffled range of values each time
        const shuffledValues = shuffle(getRange(8).map(t => t + 1));
        for (const v of shuffledValues) { // try all numbers in open cell
          board[r][c] = v; // try all numbers in open cell
          if (isValid(board)) {
            solutions.push(...solveAll(board));
            // limit number of solutions found
            if(maxSolutions != null && (solutions.length >= maxSolutions)){
              return solutions;
            }
          }
          board[r][c] = _; // backtrack if not valid
        }
        return solutions; // exhausted all numbers, return to caller
      }
    }
  }
  // no empty spots left, so this is a solution
  return isSolved(board) ? [deepCopy(board)] : []; // deep copy board, so it doesn't mutate when looking for more solutions
}

/** returns a list of all cell positions in sequential order */
export const allCells = (): CellPosition[] => getRange(8).flatMap(r => getRange(8).map(c => ({r: r, c: c})));
/** returns a list of all cell positions in random order */
export const getRandomCellOrder = (): CellPosition[] => shuffle(allCells());

/** generates a solved board somewhat randomly */
export const generateSolvedBoard = (): SudokuBoard => {
  const board = initBoard();
  solve(board, true)
  return board;
}

/** generates a solveable board with the given number of clues.
 * board is not guaranteed to have a unique solution */
export const generateBoard = (clues: number): SudokuBoard => {
  const shuffledCells = getRandomCellOrder();
  const solvedBoard = generateSolvedBoard();
  const emptyCellsNeeded = getSize(solvedBoard) - clues;
  // remove cells until we get to the appropriate number of clues
  for(let i = 0; i < emptyCellsNeeded; i++){
    const {r,c} = shuffledCells[i];
    solvedBoard[r][c] = _;
  }
  return solvedBoard;


  // if (type === 'random' && clues > 50) {
  //   console.error('Using clues > 50 (for an 81 cell board) will result in increasingly slow performance.');
  //   console.log();
  // }
  // // internal function to be called recursively
  // const genBoard = (board: SudokuBoard, clues: number): boolean => {
  //   if (getFilledCells(board) < clues) {
  //     const nextOpenCell = _getNextOpenCell(board); // determine next cell
  //     if (nextOpenCell) {
  //       const {r, c} = nextOpenCell;
  //       // instead of 1 - 9, get a shuffled range of values each time
  //       const shuffledValues = shuffle(getRange(8).map(t => t + 1));
  //       for (const v of shuffledValues) { // try all numbers in open cell
  //         // only make valid moves
  //         board[r][c] = v;
  //         if (isValid(board)) { // check if move was possible
  //           if (genBoard(board, clues))
  //             return true;
  //         }
  //         board[r][c] = _; // backtrack if not valid
  //       }
  //       return false;
  //     }
  //   }
  //   return isSolveable(board);
  // }
  //
  // const board = initBoard();
  // genBoard(board, clues);
  // return board;
  // // whileLoop:
  // //   while (getFilledCells(board) < clues) {
  // //     const nextOpenCell = getNextOpenCell(board);
  // //     if (nextOpenCell) {
  // //       console.log(nextOpenCell);
  // //       const {r, c} = nextOpenCell;
  // //       for (let v = 1; v <= 9; v++) {
  // //         board[r][c] = v;
  // //         if (isValid(board))
  // //           continue whileLoop;
  // //       }
  // //     }
  // //     break;
  // //   }
  // // return board;
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

export const analyzeBoard = (board: SudokuBoard, showAllSolutions = false) => {
  const filledCells = getFilledCells(board);
  const completeRegions = getRegions(board).filter(t => !t.some(c => !c) && isSetUnique(t)).length;
  const completeColumns = transpose(board).filter(t => !t.some(c => !c) && isSetUnique(t)).length;
  const completeRows = board.filter(t => !t.some(c => !c) && isSetUnique(t)).length;
  const regions = getRegions(board).length;
  const rows = board.length;
  const columns = transpose(board).length;
  const cells = board.flatMap(t => t).length;
  console.log(`${filledCells}/${cells} - Filled Cells`);
  console.log(`${completeRegions}/${regions} - Complete Regions`);
  console.log(`${completeColumns}/${columns} - Complete Columns`);
  console.log(`${completeRows}/${rows} - Complete Rows`);

  console.log(`isSolveable: ${isSolveable(board)}`);
  if (showAllSolutions) {
    const solutions = solveAll(board);
    console.log('Solutions: ', solutions.length);
    solutions.forEach((t, i) => {
      console.log();
      console.log(`Solution ${i + 1}`);
      logBoard(t)
    });
  }
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
  analyzeBoard(board, true);
  console.log();
}

