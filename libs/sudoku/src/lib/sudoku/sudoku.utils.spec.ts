import {TestBed} from "@angular/core/testing";
import {getRange, shuffle} from "@kablamo/utils";
import {
  _,
  areNotesEqual,
  CellPosition,
  clearInvalidNotes,
  Examples,
  generateBoard,
  getBoardSize,
  getCellColumnSet,
  getCellIndexByPosition,
  getCellPositionByIndex,
  getCellRegionPositions,
  getCellRegionSet,
  getCellRowSet,
  getFilledCells,
  getNextOpenCell,
  getNumCells,
  getRegionCellPositions,
  getRegionIndex,
  getRegionPositions,
  getRegionSets,
  hash,
  initBoard,
  isCellInRegion,
  isComplete,
  isSamePosition,
  isSameSudokuSet,
  isSetUnique,
  isSolveable,
  isSolved,
  isSubsetOf,
  isUnique,
  isValid,
  parseNotes,
  printBoard,
  printRow,
  randomizeBoard,
  RegionPosition,
  solve,
  solveAll,
  stringifyNotes,
  SudokuBoard,
  SudokuNotes,
  SudokuValue,
  toggleNote,
  transpose
} from "@kablamo/sudoku";

describe('Sudoku Utils', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should return a range from 0 to N when getRange is called', () => {
    expect(getRange(0)).toStrictEqual([0]);
    expect(getRange(1)).toStrictEqual([0, 1]);
    expect(getRange(2)).toStrictEqual([0, 1, 2]);
  })

  it('initBoard should return a blank board', () => {
    expect(initBoard()).toStrictEqual(Examples.emptyBoard);
  })

  it('initBoard should initialize a board matching the given hash', () => {
    const easyHash = '374208501005000000000100000090010800208900705750024190500702900009381207007409610';
    const board = initBoard(easyHash);
    expect(board).toBeTruthy();
    expect(hash(board)).toEqual(easyHash);
  })

  it('getBoardSize should return the width,height of a board', () => {
    expect(getBoardSize([[], []])).toEqual({r: 2, c: 0});
    expect(getBoardSize([[]])).toEqual({r: 1, c: 0});
    expect(getBoardSize([[_, _], [_, _]])).toEqual({r: 2, c: 2});
    expect(getBoardSize([[_, _, _], [_, _, _]])).toEqual({r: 2, c: 3});
    expect(getBoardSize(Examples.emptyBoard)).toStrictEqual({r: 9, c: 9});
  })

  it('getNumCells should return the number of cells in a grid', () => {
    expect(getNumCells([[]])).toEqual(0);
    expect(getNumCells([[_, _], [_, _]])).toEqual(4);
    expect(getNumCells(Examples.emptyBoard)).toEqual(81);
  })

  it('should shuffle an array', () => {
    const original = Array.from(Array(100).keys());
    const shuffled = shuffle([...original]);
    // yes it is technically possible that the array will be shuffled into the exact configuration of the original
    // but extremely unlikely.
    expect(original).not.toStrictEqual(shuffled);
    expect(new Set(shuffled).size).toBe(100); // should still contain all items
    expect(shuffled.sort((a, b) => a > b ? 1 : -1)).toStrictEqual(original); // sorting back numerically should produce original
  })

  it('should produce a hash for an array', () => {
    expect(hash(Examples.easyPreset)).toBe('374208501005000000000100000090010800208900705750024190500702900009381207007409610');
  })

  describe('notes serialization', () => {
    describe('areNotesEqual', () => {
      it('should return false if the notes do not have the same length', () => {
        const a: SudokuNotes = [[new Set([1, 2, 3])]];
        const b: SudokuNotes = [[new Set([1, 2, 3, 4])]];
        expect(areNotesEqual(a, b)).toBeFalsy();
      })
      it('should return false if the notes do not have the same values', () => {
        const a: SudokuNotes = [[new Set([1, 2, 3])]];
        const b: SudokuNotes = [[new Set([1, 2, 4])]];
        expect(areNotesEqual(a, b)).toBeFalsy();
      })
      it('should return true if the notes have the same size and values', () => {
        const a: SudokuNotes = [[new Set([1, 4, 2])]];
        const b: SudokuNotes = [[new Set([1, 4, 2])]];
        expect(areNotesEqual(a, b)).toBeTruthy();
      })
      it('should return true if both notes are empty', () => {
        expect(areNotesEqual([[]], [[]])).toBeTruthy();
      })
    })
    // notes are made up of Sets, which do not serialize to JSON for storage in Localstorage.
    // instead we must convert them to/from an array, which CAN be serialized.
    // these helper functions do the to/from conversion.
    describe('stringifyNotes', () => {
      it('should stringify the provided SudokuNotes object', () => {
        const notes: SudokuNotes = [[new Set<SudokuValue>([1, 4, 5])]];
        expect(stringifyNotes(notes)).toBe('[[[1,4,5]]]')
      })
      it('should stringify an empty array of notes', () => {
        // this case shouldn't normally happen, since we always initialize to [[]]
        let notes: SudokuNotes = [];
        expect(stringifyNotes(notes)).toBe('[]');
        // this is the normal initialized notes value
        notes = [[]];
        expect(stringifyNotes(notes)).toBe('[[]]')
      })
    })
    describe('parseNotes', () => {
      it('should parse an empty stringified SudokuNotes object', () => {
        const notes: SudokuNotes = [[]];
        const stringifiedNotes = stringifyNotes(notes);
        expect(areNotesEqual(parseNotes(stringifiedNotes), notes)).toBeTruthy();
      })
      it('should parse a non-empty stringified SudokuNotes object', () => {
        const notes: SudokuNotes = [[new Set<SudokuValue>([1, 4, 5])]];
        const stringifiedNotes = stringifyNotes(notes);
        expect(areNotesEqual(parseNotes(stringifiedNotes), notes)).toBeTruthy();
      })
      it('should parse a null value to an empty 2-d array', () => {
        const notes: SudokuNotes = [[]];
        expect(areNotesEqual(parseNotes(null), notes)).toBeTruthy();
      })
    })
  })

  describe('region and cell positions', () => {
    it('should return all region positions', () => {
      const regions = getRegionPositions();
      expect(regions).toHaveLength(9);
      expect(regions).toMatchSnapshot();
    })

    it('should return the corresponding region for the given cell when getCellRegionPositions is called', () => {
      expect(getCellRegionPositions({r: 0, c: 0})).toStrictEqual({r: 0, c: 0});
      expect(getCellRegionPositions({r: 3, c: 3})).toStrictEqual({r: 1, c: 1});
      expect(getCellRegionPositions({r: 3, c: 7})).toStrictEqual({r: 1, c: 2});
      expect(getCellRegionPositions({r: 8, c: 8})).toStrictEqual({r: 2, c: 2});
    })

    it('should return the cell position by index', () => {
      expect(getCellPositionByIndex(0)).toStrictEqual({r: 0, c: 0});
      expect(getCellPositionByIndex(80)).toStrictEqual({r: 8, c: 8});
      expect(getCellPositionByIndex(11)).toStrictEqual({r: 1, c: 2});
    })

    it('should return cell index by position', () => {
      const board = Examples.emptyBoard;
      expect(getCellIndexByPosition(board, {r: 0, c: 0})).toBe(0);
      expect(getCellIndexByPosition(board, {r: 3, c: 5})).toBe(32);
      expect(getCellIndexByPosition(board, {r: 8, c: 8})).toBe(80);
    })

    it('should return all of the cell positions within a given region', () => {
      const region: RegionPosition = {r: 0, c: 0};
      const cells = getRegionCellPositions(region);
      expect(cells).toHaveLength(9);
      expect(cells).toMatchSnapshot();
    })

    it('should return true if the cell is in the region', () => {
      const region: RegionPosition = {r: 0, c: 0};
      const cellInRegion: CellPosition = {r: 2, c: 2};
      const cellOutRegion: CellPosition = {r: 0, c: 3};
      expect(isCellInRegion(region, cellInRegion)).toBeTruthy();
      expect(isCellInRegion(region, cellOutRegion)).toBeFalsy();
    })
  })

  describe('getNextOpenCell', () => {
    it('should return undefined if the board is full', () => {
      expect(getNextOpenCell(Examples.solved)).toBeUndefined();
    })

    it('should return the first cell if the board is empty', () => {
      expect(getNextOpenCell(Examples.emptyBoard)).toStrictEqual({r: 0, c: 0});
    })

    it('should return the next sequential row/column that is empty', () => {
      const board = Examples.solved;
      board[5][6] = _;
      expect(getNextOpenCell(board)).toStrictEqual({r: 5, c: 6});
    })

    it('should return the cell according to the cell order', () => {
      const cellOrder = [{r: 5, c: 6}];
      expect(getNextOpenCell(Examples.emptyBoard, cellOrder)).toStrictEqual(cellOrder[0]);
    })
  })

  describe('filledCells', () => {
    it('should return 0 for an empty board', () => {
      expect(getFilledCells(Examples.emptyBoard)).toEqual(0);
    })

    it('should return the size of a board for a solved board', () => {
      const size = getNumCells(Examples.solved);
      expect(getFilledCells(Examples.solved)).toEqual(size);
    })

    it('should return the number of filled cells', () => {
      const board = Examples.emptyBoard;
      board[0][0] = 1;
      board[1][1] = 1;
      board[2][2] = 1;
      expect(getFilledCells(board)).toEqual(3);
    })
  })

  describe('analytics', () => {
    describe('isUnique', () => {
      it('should return true if a board has only one solution', () => {
        expect(isUnique(Examples.easyPreset)).toBeTruthy();
      })
      it('should return false if a board has no solutions', () => {
        expect(isUnique(Examples.easyPresetInvalidRegion)).toBeFalsy();
      })
      it('should return false if a board is complete and invalid', () => {
        expect(isComplete(Examples.invalidRegions)).toBeTruthy();
        expect(isUnique(Examples.invalidRegions)).toBeFalsy();
      })
      it('should return false if a board has more than one solution', () => {
        expect(isUnique(Examples.twoSolutions)).toBeFalsy();
      })
    })

    describe('isSolveable', () => {
      it('should return true if a board has one solution', () => {
        expect(isSolveable(Examples.easyPreset)).toBeTruthy();
      })
      it('should return true if a board has more than one solution', () => {
        expect(isSolveable(Examples.twoSolutions)).toBeTruthy();
      })
      it('should return false if a board is complete but invalid', () => {
        expect(isComplete(Examples.invalidRegions)).toBeTruthy();
        expect(isSolveable(Examples.invalidRegions)).toBeFalsy();
      })
      it('should return true for an empty board', () => {
        expect(isSolveable(Examples.emptyBoard)).toBeTruthy();
      })
      it('should return false if a board is valid but has no solutions', () => {
        expect(isSolveable(Examples.noSolutions)).toBeFalsy();
      })
    })
  })

  describe('isSameSet', () => {
    it('should return true if two cells are in the same column', () => {
      const a = {r: 1, c: 3};
      const b = {r: 8, c: 3};
      expect(isSameSudokuSet(a, b)).toBeTruthy();
    })

    it('should return true if two cells are in the same row', () => {
      const a = {r: 6, c: 0};
      const b = {r: 6, c: 8};
      expect(isSameSudokuSet(a, b)).toBeTruthy();
    })

    it('should return true if two cells are in the same region', () => {
      const a = {r: 6, c: 6};
      const b = {r: 8, c: 8};
      expect(isSameSudokuSet(a, b)).toBeTruthy();
    })

    it('should return true if two cells do not share any sets', () => {
      const a = {r: 0, c: 0};
      const b = {r: 4, c: 4};
      expect(isSameSudokuSet(a, b)).toBeFalsy();
    })
  })

  describe('isSamePosition', () => {
    it('should return true if two cells have the same coordinates', () => {
      const a = {r: 6, c: 8};
      const b = {r: 6, c: 8};
      expect(isSamePosition(a, b)).toBeTruthy();
    })

    it('should return false if two cells have different rows', () => {
      const a = {r: 1, c: 3};
      const b = {r: 8, c: 3};
      expect(isSamePosition(a, b)).toBeFalsy();
    })

    it('should return false if two cells have different columns', () => {
      const a = {r: 3, c: 4};
      const b = {r: 3, c: 5};
      expect(isSamePosition(a, b)).toBeFalsy();
    })

    it('should return false if two cells have different rows and columns', () => {
      const a = {r: 1, c: 4};
      const b = {r: 2, c: 5};
      expect(isSamePosition(a, b)).toBeFalsy();
    })
  })

  describe('isSubsetOf', () => {
    it('should return true when the source is a subset of the target', () => {
      const source = Examples.solved;
      source[0][0] = _;
      expect(isSubsetOf(source, Examples.solved)).toBeTruthy();
    })

    it('should return true when the source is an empty board', () => {
      expect(isSubsetOf(Examples.emptyBoard, Examples.solved)).toBeTruthy();
    })

    it('should return true when the source and target are the same', () => {
      expect(isSubsetOf(Examples.solved, Examples.solved)).toBeTruthy();
    })

    it('should return false when the source is not subset of the target', () => {
      const source = Examples.easyPreset;
      source[1][0] = 1;
      expect(isSubsetOf(source, Examples.easyPreset)).toBeFalsy();
    })
  })

  describe('isComplete', () => {
    it('should return true for a complete board', () => {
      expect(isComplete(Examples.solved)).toBeTruthy();
    })

    it('should return true for a complete, but invalid board', () => {
      expect(isComplete(Examples.invalidRegions)).toBeTruthy();
    })

    it('should return false for an incomplete board', () => {
      expect(isComplete(Examples.easyPreset)).toBeFalsy();
    })
  })

  describe('isSolved', () => {
    it('should return false if the board is invalid', () => {
      // full but not valid board
      expect(isSolved(Examples.invalidRegions)).toBeFalsy();
    })

    it('should return false if the board has empty cells', () => {
      // valid but not full
      expect(isSolved(Examples.easyPreset)).toBeFalsy();
    })

    it('should return true if the board is valid and full', () => {
      expect(isSolved(Examples.solved)).toBeTruthy();
    })
  })

  describe('isBoardValid', () => {


    it('should return false if any row is invalid', () => {
      expect(isValid([
        [_, _, 1, _, _, _, 1, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _]
      ])).toBeFalsy();
    })
    it('should return false if any column is invalid', () => {
      expect(isValid([
        [_, _, 1, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, 1, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _]
      ])).toBeFalsy();
    })
    it('should return false if any region is invalid', () => {
      expect(isValid([
        [_, _, 1, _, _, _, _, _, _],
        [_, 1, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _]
      ])).toBeFalsy();
    })

    it('should return true for an empty board', () => {
      expect(isValid(Examples.emptyBoard)).toBeTruthy();
    })

    it('should return true if all rows, columns, and regions are valid', () => {
      expect(isValid(Examples.solved)).toBeTruthy();
    })
  })

  // printing doesn't really need to be tested, because we can define whatever
  // we want for the console, however it should be consistent
  describe('printing', () => {
    it('should match the printRow snapshot', () => {
      expect(printRow([1, 2, 3, _, _, 6, 7, _, 9])).toMatchSnapshot();
    })
    it('should match the printBoard snapshot', () => {
      expect(printBoard(Examples.easyPreset)).toMatchSnapshot();
    })
  })

  describe('transpose', () => {
    it('should transpose a 2-d array', () => {
      expect(transpose([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ])).toStrictEqual([
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9]
      ]);
    })

    it('should transpose a board', () => {
      expect(transpose(Examples.solved)).toStrictEqual([
        [3, 1, 9, 4, 2, 7, 5, 6, 8],
        [7, 8, 6, 9, 1, 5, 3, 4, 2],
        [4, 5, 2, 6, 8, 3, 1, 9, 7],
        [2, 6, 1, 5, 9, 8, 7, 3, 4],
        [9, 7, 4, 1, 3, 2, 6, 8, 5],
        [8, 3, 5, 7, 6, 4, 2, 1, 9],
        [5, 4, 3, 8, 7, 1, 9, 2, 6],
        [6, 2, 7, 3, 4, 9, 8, 5, 1],
        [1, 9, 8, 2, 5, 6, 4, 7, 3]
      ]);
    });
  })

  describe('isSetUnique', () => {
    it('should detect uniqueness of sets of numbers', () => {
      expect(isSetUnique([_, _])).toBeTruthy();
      expect(isSetUnique([_, 1])).toBeTruthy();
      expect(isSetUnique([1, 1])).toBeFalsy();
    })

    it('should detect uniqueness of sets of letters', () => {
      expect(isSetUnique([_, 'a'])).toBeTruthy();
      expect(isSetUnique(['a', 'b'])).toBeTruthy();
      expect(isSetUnique(['a', 'a'])).toBeFalsy();
    })

    it('should detect uniqueness of sets of objects', () => {
      const a = {};
      const b = {};
      expect(isSetUnique([_, a])).toBeTruthy();
      expect(isSetUnique([a, b])).toBeTruthy();
      expect(isSetUnique([a, a])).toBeFalsy();
    })

    it('should detect uniqueness of sudokuSets', () => {
      // sudokuSet examples
      expect(isSetUnique([_, _, _, _, _, _, _, _, _])).toBeTruthy();
      expect(isSetUnique([_, _, _, _, _, _, _, _, _])).toBeTruthy();
      expect(isSetUnique([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBeTruthy();
      expect(isSetUnique([1, _, _, _, _, _, _, _, 1])).toBeFalsy();
    })
  })

  describe('getRegions', () => {
    it('should get the board divided into 3x3 regions', () => {
      expect(getRegionSets(Examples.easyPreset)).toStrictEqual([
        [3, 7, 4, _, _, 5, _, _, _],
        [2, _, 8, _, _, _, 1, _, _],
        [5, _, 1, _, _, _, _, _, _],
        [_, 9, _, 2, _, 8, 7, 5, _],
        [_, 1, _, 9, _, _, _, 2, 4],
        [8, _, _, 7, _, 5, 1, 9, _],
        [5, _, _, _, _, 9, _, _, 7],
        [7, _, 2, 3, 8, 1, 4, _, 9],
        [9, _, _, 2, _, 7, 6, 1, _]
      ]);
    })
  })

  describe('solving', () => {

    describe('solve', () => {
      it('the original board should be a subset of the solved board', () => {
        const board = Examples.easyPreset;
        solve(board);
        expect(isSubsetOf(Examples.easyPreset, board)).toBeTruthy();
      })

      it('should not modify the board if it is already solved', () => {
        const board = Examples.solved;
        solve(board);
        expect(board).toBe(board);
      })

      it('should return false if board is not solveable', () => {
        expect(solve(Examples.easyPresetInvalidRegion)).toBeFalsy();
      })

      it('should return true if board is solveable', () => {
        expect(solve(Examples.easyPreset)).toBeTruthy();
      })

      it('should solve a blank board', () => {
        const board = [...Examples.emptyBoard];
        expect(solve(board)).toBeTruthy();
        expect(isSolved(board)).toBeTruthy();
        expect(isValid(board)).toBeTruthy();
      })
    });

    describe('solveAll', () => {
      it('the original board should be a subset of the solved board', () => {
        const board = Examples.easyPreset;
        const solutions = solveAll(board);
        expect(isSubsetOf(Examples.easyPreset, solutions[0])).toBeTruthy();
      })

      it('should not modify the board', () => {
        const board = Examples.easyPreset;
        solveAll(board);
        expect(board).toStrictEqual(Examples.easyPreset);
      })

      it('should return an empty set if board is not solveable', () => {
        // incomplete invalid board
        expect(solveAll(Examples.easyPresetInvalidRegion)).toHaveLength(0);
        // complete invalid board
        expect(solveAll(Examples.invalidRegions)).toHaveLength(0);
      })

      it('should return a valid solution if board is solveable', () => {
        const solutions = solveAll(Examples.easyPreset);
        expect(solutions).toHaveLength(1);
        expect(isSolved(solutions[0]));
        expect(isSubsetOf(Examples.easyPreset, solutions[0]));
      })

      it('should return all valid solutions if the board has more than one', () => {
        const solutions = solveAll(Examples.twoSolutions);
        expect(solutions).toHaveLength(2);
        solutions.forEach(t => {
          expect(isSolved(t));
          expect(isSubsetOf(Examples.easyPreset, t));
        });
      })

      it('should return the maxSolutions number of solutions if provided', () => {
        const solutions = solveAll(Examples.twoSolutions, 1);
        expect(solutions).toHaveLength(1);
        solutions.forEach(t => {
          expect(isSolved(t));
          expect(isSubsetOf(Examples.easyPreset, t));
        });
      })

      // you'd be crazy to do this :)
      it.skip('should solve a blank board', () => {
        expect(solveAll(Examples.emptyBoard)).toHaveLength(6670903752021072936960);
      })

      it('should return after maxSolutions are found if provided', () => {
        expect(solveAll(Examples.twoSolutions, 1)).toHaveLength(1);
      })
    })

    describe('randomizeBoard', () => {
      beforeEach(() => {
        jest.spyOn(Math, 'random').mockImplementation(
          (() => {
            let index = 0;
            const arrayOfValues = [0.1, 0.2, 0.3, 0.7, 0.8, 0.9, 0.4, 0.5, 0.6];
            return () => {
              return arrayOfValues[index++ % 9];
            };
          })()
        );
      })

      it('should produce a random board', () => {
        const board = Examples.emptyBoard;
        randomizeBoard(board);
        expect(printBoard(board)).toMatchSnapshot();
      })
    })

    describe('generateBoard', () => {
      it('should generate an empty board for zero clues', () => {
        expect(generateBoard(0)).toStrictEqual(Examples.emptyBoard);
      })

      it('should generate a solved board for size(board) clues', () => {
        expect(isSolved(generateBoard(81))).toBeTruthy();
      })

      it('should generate a solveable board with x clues', () => {
        const board = generateBoard(10);
        expect(getFilledCells(board)).toEqual(10);
        expect(isValid(board)).toBeTruthy();
        expect(solve(board)).toBeTruthy();
      })
    })
  })

  describe('getRegionIndex', () => {
    it('should get the zero based index for the region', () => {
      // regions are numbered from left to right top to bottom
      // currently, getRegionIndex assumes a 9x9 board with 3x3 regions, but this should be abstracted
      // later for other board sizes and region sizes
      expect(getRegionIndex({r: 0, c: 0})).toBe(0);
      expect(getRegionIndex({r: 1, c: 1})).toBe(4);
      expect(getRegionIndex({r: 2, c: 2})).toBe(8);
    })
  })
  describe('get sets', () => {
    let board: SudokuBoard;
    beforeEach(() => {
      board = [
        [3, 7, 4, 2, _, 8, 5, _, 1],
        [_, _, 5, _, _, _, _, _, _],
        [_, _, _, 1, _, _, _, _, _],
        [_, 9, _, _, 1, _, 8, _, _],
        [2, _, 8, 9, _, _, 7, _, 5],
        [7, 5, _, _, 2, 4, 1, 9, _],
        [5, _, _, 7, _, 2, 9, _, _],
        [_, _, 9, 3, 8, 1, 2, _, 7],
        [_, _, 7, 4, _, 9, 6, 1, _],
      ];
    })
    describe('getCellRegionSet', () => {
      it('should get the set of values for the region containing the cell position', () => {
        expect(getCellRegionSet(board, {r: 0, c: 0})).toStrictEqual([3, 7, 4, _, _, 5, _, _, _]);
        expect(getCellRegionSet(board, {r: 0, c: 2})).toStrictEqual([3, 7, 4, _, _, 5, _, _, _]);
        expect(getCellRegionSet(board, {r: 8, c: 8})).toStrictEqual([9, _, _, 2, _, 7, 6, 1, _]);
      })
    })

    describe('getCellRowSet', () => {
      it('should get the set of values for the row containing the cell position', () => {
        expect(getCellRowSet(board, {r: 0, c: 0})).toStrictEqual([3, 7, 4, 2, _, 8, 5, _, 1]);
        expect(getCellRowSet(board, {r: 0, c: 2})).toStrictEqual([3, 7, 4, 2, _, 8, 5, _, 1]);
        expect(getCellRowSet(board, {r: 8, c: 8})).toStrictEqual([_, _, 7, 4, _, 9, 6, 1, _]);
      })
    })

    describe('getCellColumnSet', () => {
      it('should get the set of values for the row containing the cell position', () => {
        const board = Examples.easyPreset;
        expect(getCellColumnSet(board, {r: 0, c: 0})).toStrictEqual([3, _, _, _, 2, 7, 5, _, _]);
        expect(getCellColumnSet(board, {r: 1, c: 0})).toStrictEqual([3, _, _, _, 2, 7, 5, _, _]);
        expect(getCellColumnSet(board, {r: 8, c: 8})).toStrictEqual([1, _, _, _, 5, _, _, 7, _]);
      })
    })
  })

  describe('clearInvalidNotes', () => {
    let board: SudokuBoard;
    beforeEach(() => {
      board = [
        [3, 7, 4, 2, _, 8, 5, _, 1],
        [_, _, 5, _, _, _, _, _, _],
        [_, _, _, 1, _, _, _, _, _],
        [_, 9, _, _, 1, _, 8, _, _],
        [2, _, 8, 9, _, _, 7, _, 5],
        [7, 5, _, _, 2, 4, 1, 9, _],
        [5, _, _, 7, _, 2, 9, _, _],
        [_, _, 9, 3, 8, 1, 2, _, 7],
        [_, _, 7, 4, _, 9, 6, 1, _],
      ];
    })
    it('should clear any note values that are not valid within a row', () => {
      const notes: SudokuNotes = [];
      const pos: CellPosition = {r:2,c:0};
      const invalidValue: SudokuValue = 1;
      const validValue: SudokuValue = 9;
      toggleNote(pos, invalidValue, notes);
      toggleNote(pos, validValue, notes);
      clearInvalidNotes(board,notes);
      expect(notes[pos.r][pos.c].has(invalidValue)).toBeFalsy();
      expect(notes[pos.r][pos.c].has(validValue)).toBeTruthy();
    })
    it('should clear any note values that are not valid within a column', () => {
      const notes: SudokuNotes = [];
      const pos: CellPosition = {r:1,c:0};
      const invalidValue: SudokuValue = 2;
      const validValue: SudokuValue = 6;
      toggleNote(pos, invalidValue, notes);
      toggleNote(pos, validValue, notes);
      clearInvalidNotes(board,notes);
      expect(notes[pos.r][pos.c].has(invalidValue)).toBeFalsy();
      expect(notes[pos.r][pos.c].has(validValue)).toBeTruthy();
    })
    it('should clear any note values that are not valid within a region', () => {
      const notes: SudokuNotes = [];
      const pos: CellPosition = {r:1,c:0};
      const invalidValue: SudokuValue = 4;
      const validValue: SudokuValue = 6;
      toggleNote(pos, invalidValue, notes);
      toggleNote(pos, validValue, notes);
      clearInvalidNotes(board,notes);
      expect(notes[pos.r][pos.c].has(invalidValue)).toBeFalsy();
      expect(notes[pos.r][pos.c].has(validValue)).toBeTruthy();
    })
    it('should not clear any note values that are valid', () => {
      const notes: SudokuNotes = [];
      const pos: CellPosition = {r:1,c:0};
      toggleNote(pos, 9, notes);
      toggleNote(pos, 8, notes);
      toggleNote(pos, 6, notes);
      clearInvalidNotes(board,notes);
      expect(notes[pos.r][pos.c].has(9)).toBeTruthy();
      expect(notes[pos.r][pos.c].has(8)).toBeTruthy();
      expect(notes[pos.r][pos.c].has(6)).toBeTruthy();
    })
  })

  describe('toggleNote', () => {
    let notes: SudokuNotes;
    beforeEach(() => notes = [])
    it('should add the value to the set of notes for the given cell position if not already added', () => {
      const pos: CellPosition = {r: 1, c: 0};
      toggleNote(pos, 9, notes);
      expect(notes[pos.r][pos.c].size).toBe(1);
      expect(notes[pos.r][pos.c].has(9)).toBeTruthy();
      toggleNote(pos, 8, notes);
      expect(notes[pos.r][pos.c].size).toBe(2);
      expect(notes[pos.r][pos.c]).toContain(8);
    })
    it('should clear the value in the set of notes for the given cell position if already added', () => {
      const pos: CellPosition = {r: 1, c: 0};
      toggleNote(pos, 9, notes);
      expect(notes[pos.r][pos.c].size).toBe(1);
      expect(notes[pos.r][pos.c].has(9)).toBeTruthy();
      toggleNote(pos, 9, notes);
      expect(notes[pos.r][pos.c].size).toBe(0);
    })
  })

});
