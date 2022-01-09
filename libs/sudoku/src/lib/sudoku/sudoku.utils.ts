/** This file holds the stateless logic/functions needed for a sudoku game */
import {_} from "./sudoku.examples";
import {deepCopy, getRange, shuffle} from "../../../../utils/src/lib/utils";

export type SudokuValue = number;
export type SudokuSet = SudokuValue[];
export type SudokuBoard = SudokuSet[];
/** notes for a single cell
 * NOTE: these are not serializable to JSON, so when storing them as JSON convert to/from an Array
 */
export type SudokuNote = Set<SudokuValue>;
/** notes for an entire board */
export type SudokuNotes = SudokuNote[][];
/** represents a turn in a sudoku game */
export type SudokuAction = {
  pos: CellPosition;
  oldValue: SudokuValue;
  newValue: SudokuValue;
};

export const printRow = (row: SudokuSet): string => {
  const separator = (index: number) => (index < 8 && (index + 1) % 3 === 0) ? '|' : '';
  const printCell = (value: SudokuValue) => value || ' ';
  const result = row.map((cell, i) => printCell(cell) + separator(i)).join('');
  return `${result}`.split('').join(' ');
}

export const printBoard = (board: SudokuBoard): string => {
  const separator = (index: number) => ((index < 8 && (index + 1) % 3 === 0) ? `--- --- ---` + '\n' : '').split('').join(' ');
  return board.map((row, i) => printRow(row) + '\n' + separator(i)).join('') + '';
}

/** initializes an empty board, or a board matching the given hash if provided */
export const initBoard = (hash?: SudokuHash): SudokuBoard => hash ? initBoardFromHash(hash) : GetEmptyBoard();

/** initializes a board from the given hash */
const initBoardFromHash = (hash: SudokuHash): SudokuBoard => {
  const board = initBoard();
  hash.split('').forEach((t, i) => {
    const {r, c} = getCellPositionByIndex(i);
    board[r][c] = +t;
  })
  return board;
}

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

const GetEmptyBoard = (): SudokuBoard => getRange(8).map(() => getRange(8).map(() => _));

/** returns an array of all region positions within the board */
export const getRegionPositions = (): RegionPosition[] =>
  getRange(2).flatMap(r => getRange(2).map(c => ({r: r, c: c})));

/** returns all 3x3 region set values of the board */
export const getRegionSets = (board: SudokuBoard): SudokuSet[] =>
  getRegionPositions().map(({r, c}) =>
    board.slice(r * 3, r * 3 + 3).flatMap(t => t.slice(c * 3, c * 3 + 3)));

/** gets the index of the region in order left to right top to bottom */
export const getRegionIndex = (regionPosition: RegionPosition): number => {
  const regionWidth = 3;
  return regionPosition.r * regionWidth + regionPosition.c;
}

/** gets the cell positions of all cells within in the given region */
export const getRegionCellPositions = (region: RegionPosition): CellPosition[] => {
  const regionWidth = 3;
  const regionHeight = 3;
  const rows = Array.from(Array(regionHeight).keys()).map(r => regionHeight * region.r + r);
  const columns = Array.from(Array(regionWidth).keys()).map(c => regionWidth * region.c + c);
  return rows.flatMap(r => columns.map(c => ({r: r, c})));
}
/** returns true if the given cell is contained within the given region */
export const isCellInRegion = (regionIndex: RegionPosition, cellPosition: CellPosition): boolean =>
  getRegionCellPositions(regionIndex).some(t => t.c === cellPosition.c && t.r === cellPosition.r);

/** true if all sets of cells are unique within their respective rows, columns, and square regions */
export const isValid = (board: SudokuBoard): boolean => {
  const rows = board;
  const columns = transpose(board);
  const regions = getRegionSets(board);
  return ![...rows, ...columns, ...regions].some(set => !isSetUnique(set));
}

/** returns true if a board has only one solution
 * This will return false faster than it will return true */
export const isUnique = (board: SudokuBoard): boolean => solveAll(board, 2).length === 1;

/** tests whether a board has any solutions */
export const isSolveable = (board: SudokuBoard): boolean => solve(deepCopy(board));

/** returns true if there are no empty cells */
export const isComplete = (board: SudokuBoard): boolean => !board.flatMap(t => t).some(cell => !cell);

/** returns true if the board is valid and complete */
export const isSolved = (board: SudokuBoard): boolean => isComplete(board) && isValid(board);

export type SudokuHash = string;
/** returns a unique identifier for the board */
export const hash = (board: SudokuBoard): SudokuHash => board.flat().join('');

/** the zero based r,c coordinates of a cell */
export type CellPosition = { r: number, c: number };
/** the zero based r,c coordinates of a region, within the grid of regions.
 * Not to be confused with the cell positions of cells in a region.
 */
export type RegionPosition = CellPosition;

/** gets the cell position in r,c format, from a given sequential index within the board. */
export const getCellPositionByIndex = (i: number): CellPosition => ({r: (i - i % 9) / 9, c: i % 9});

export const getCellIndexByPosition = (board: SudokuBoard, pos: CellPosition): number => pos && board && pos.r * board[0].length + pos.c;

/** gets the region position in r,c format, from a given cell position within the board */
export const getCellRegionPositions = (position: CellPosition): RegionPosition =>
  getRegionPositions().find(p => isCellInRegion(p, position)) as RegionPosition;

/** gets the set of values for the region containing the cell position */
export const getCellRegionSet = (board: SudokuBoard, pos: CellPosition): SudokuSet => {
  const region = getCellRegionPositions(pos);
  const regionIndex = getRegionIndex(region);
  return getRegionSets(board)[regionIndex];
}
/** gets the set of values for the row containing the cell position */
export const getCellRowSet = (board: SudokuBoard, pos: CellPosition): SudokuSet => board[pos.r];
/** gets the set of values for the column containing the cell position */
export const getCellColumnSet = (board: SudokuBoard, pos: CellPosition): SudokuSet => transpose(board)[pos.c];

/** returns true if two positions are in the same set */
export const isSameSudokuSet = (a: CellPosition, b: CellPosition): boolean => {
  const region = getCellRegionPositions(b);
  return b.r === a.r || b.c === a.c || (region != null && isCellInRegion(region, a));
}

/** returns true if two positions have the same coordinates */
export const isSamePosition = (a: CellPosition, b: CellPosition): boolean => a.r === b.r && a.c === b.c;


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
    const values = (random ? getRange(8) : shuffle(getRange(8))).map(t => t + 1);
    for (const v of values) { // try all numbers in open cell
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
  return isValid(board); // no more open cells, solved;
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
            if (maxSolutions != null && (solutions.length >= maxSolutions)) {
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
  const emptyCellsNeeded = getNumCells(solvedBoard) - clues;
  // remove cells until we get to the appropriate number of clues
  for (let i = 0; i < emptyCellsNeeded; i++) {
    const {r, c} = shuffledCells[i];
    solvedBoard[r][c] = _;
  }
  return solvedBoard;
}

/** returns true if all filled cells from the source are the same in the target */
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

/** the size of a board: width, height */
export type BoardSize = CellPosition;
export const getBoardSize = (board: SudokuBoard): BoardSize => ({r: board.length, c: board[0].length});
/** returns the number of cells in a board */
export const getNumCells = (board: SudokuBoard): number => board.length * board[0].length;

/** gets a stringified version of the notes for use in local storage
 *  sets are not serializable, so convert to array in local storage*/
export const stringifyNotes = (notes: SudokuNotes) => JSON.stringify(notes.map((r) => r?.map((c) => [...c])));
/** parses the stringified version of notes from local storage
 *  sets are not serializable, so convert to array in local storage*/
export const parseNotes = (value: string | null): SudokuNotes => {
  const storedNotes = ((value && JSON.parse(value)) ?? [[]]) as SudokuNotes;
  return storedNotes.map((r) =>
    r?.map((c) => new Set<SudokuValue>(c))
  );
}

/** returns true if the sets of notes are the same size and each corresponding
 * pair of notes hase the same values in the same order.
 * We do not sort values currently, so the sets may have the correct values but in the wrong order and
 * will not be considered equal.
 * During normal serialization/deserialization we should not have to worry about order. */
export const areNotesEqual = (a: SudokuNotes, b: SudokuNotes) => stringifyNotes(a) === stringifyNotes(b)

/** clear any notes that would be invalid in their sets */
export const clearInvalidNotes = (board: SudokuBoard, notes: SudokuNotes) => {
  type notePosition = { pos: CellPosition, note: SudokuNote };
  // get any notes that have values
  const filledNotes: notePosition[] =
    notes.flatMap((row, r) => row &&
      row.map((note, c) => ({pos: {r: r, c: c}, note})))
      .filter(t => t?.note?.size);

  const clearNote = (n: notePosition) => {
    const region = getCellRegionSet(board, n.pos);
    const row = getCellRowSet(board, n.pos);
    const column = getCellColumnSet(board, n.pos);
    const noteIsInvalid = (v: SudokuValue) => region.includes(v) || row.includes(v) || column.includes(v);
    n.note.forEach(v => noteIsInvalid(v) && n.note.delete(v));
  }

  filledNotes.forEach(t => clearNote(t));
}

/** toggles a given note value on/off for the given cell */
export const toggleNote = (pos: CellPosition, value: SudokuValue, notes: SudokuNotes) => {
  const {r, c} = pos;
  // init notes, we don't initialize every value by default, untouched notes will be undefined
  notes[r] = notes[r] ?? [];
  notes[r][c] = notes[r][c] ?? new Set<SudokuValue>();
  const note = notes[r][c];
  note.has(value) ? note.delete(value) : note.add(value);
  notes[r][c] = new Set<SudokuValue>([...note]);
}

/** finds a solution for the board, and returns the value at the given position
 * If no solutions, reject with an error */
export const solveCell = async (
  pos: CellPosition,
  boardHash: SudokuHash
): Promise<SudokuValue> =>
  await new Promise((resolve, reject) => {
    const board = initBoard(boardHash);
    // if cell is already filled throw error, in the future we could delete it then solve it
    if (board[pos.r][pos.c]) reject('Cell is already filled');
    const isSolved = solve(board);
    if (!isSolved) reject('No solutions found');
    const solvedValue = board[pos.r][pos.c];
    resolve(solvedValue);
  });

/** returns a board where the invalid entries have been cleared */
export const getInvalidMap = (board: SudokuBoard): SudokuBoard => {
  const result = initBoard(hash(board));

  const getDuplicates = (t: SudokuSet): SudokuSet => t.filter((e, i, a) => a.indexOf(e) !== i);

  const invalidRows: { row: SudokuSet, r: number }[] = result.map((row, r) => ({
    row: row,
    r: r
  })).filter(t => !isSetUnique(t.row));
  const invalidRowCells: CellPosition[] = invalidRows.flatMap(({row, r}) => {
    const duplicates = getDuplicates(row);
    return row.map((cell, c) => ({pos: {r: r, c: c}, value: cell}))
      .filter(t => duplicates.includes(t.value))
      .map(t => t.pos);
  });

  const invalidColumns: { col: SudokuSet, c: number }[] = transpose(result).map((col, c) => ({
    col: col,
    c: c
  })).filter(t => !isSetUnique(t.col));
  const invalidColCells: CellPosition[] = invalidColumns.flatMap(({col, c}) => {
    const duplicates = getDuplicates(col);
    return col.map((cell, r) => ({pos: {r: r, c: c}, value: result[r][c]}))
      .filter(t => duplicates.includes(t.value))
      .map(t => t.pos);
  });

  const invalidRegions = getRegionPositions()
    .map(region => getRegionCellPositions(region).map(pos => ({pos: pos, value: result[pos.r][pos.c]})))
    .filter(cells => !isSetUnique(cells.map(cell => cell.value)));
  const invalidRegionCells: CellPosition[] = invalidRegions.flatMap(region => {
    const duplicates = getDuplicates(region.map(t => t.value));
    return region
      .filter(t => duplicates.includes(t.value))
      .map(t => t.pos);
  });

  // clear invalid cells from map
  [...invalidRowCells, ...invalidColCells, ...invalidRegionCells].forEach(t => result[t.r][t.c] = _);

  return result;
}
