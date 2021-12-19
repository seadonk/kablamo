import {TestBed} from '@angular/core/testing';
import {
  _,
  easyPreset,
  easyPresetInvalidRegion,
  emptyBoard,
  getRange,
  getRegions,
  initBoard,
  invalidRegions,
  isComplete,
  isSetUnique,
  isSolved,
  isValid,
  printBoard,
  printRow,
  solve,
  solved,
  transpose
} from "@kablamo/utils";


describe('Sudoku', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should return a range from 0 to N when getRange is called', () => {
    expect(getRange(0)).toStrictEqual([0]);
    expect(getRange(1)).toStrictEqual([0, 1]);
    expect(getRange(2)).toStrictEqual([0, 1, 2]);
  })

  it('initBoard should return a blank board', () => {
    expect(initBoard()).toStrictEqual(emptyBoard);
  })

  describe('isComplete', () => {
    it('should return true for a complete board', () => {
      expect(isComplete(solved)).toBeTruthy();
    })

    it('should return true for a complete, but invalid board', () => {
      expect(isComplete(invalidRegions)).toBeTruthy();
    })

    it('should return false for an incomplete board', () => {
      expect(isComplete(easyPreset)).toBeFalsy();
    })
  })

  describe('isSolved', () => {
    it('should return false if the board is invalid', () => {
      // full but not valid board
      expect(isSolved(invalidRegions)).toBeFalsy();
    })

    it('should return false if the board has empty cells', () => {
      // valid but not full
      expect(isSolved(easyPreset)).toBeFalsy();
    })

    it('should return true if the board is valid and full', () => {
      expect(isSolved(solved)).toBeTruthy();
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
      expect(isValid(emptyBoard)).toBeTruthy();
    })

    it('should return true if all rows, columns, and regions are valid', () => {
      expect(isValid(solved)).toBeTruthy();
    })
  })

  // printing doesn't really need to be tested, because we can define whatever
  // we want for the console, however it should be consistent
  describe('printing', () => {
    it('should match the printRow snapshot', () => {
      expect(printRow([1, 2, 3, _, _, 6, 7, _, 9])).toMatchSnapshot();
    })
    it('should match the printBoard snapshot', () => {
      expect(printBoard(easyPreset)).toMatchSnapshot();
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
      expect(transpose(solved)).toStrictEqual([
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
      expect(getRegions(easyPreset)).toStrictEqual([
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
    it('the original board should be a subset of the solved board', () => {
      const board = [...easyPreset];
    })

    it('should not modify the board if it is already solved', () => {
      const board = [...solved];
      solve(board);
      expect(solved).toBe(solved);
    })

    it('should return false if board is not solveable', () => {
      expect(solve(easyPresetInvalidRegion)).toBeFalsy();
    })

    it('should return true if board is solveable', () => {
      expect(solve(easyPreset)).toBeTruthy();
    })

    it('should solve a blank board', () => {
      const board = [...emptyBoard];
      expect(solve(board)).toBeTruthy();
      expect(isSolved(board)).toBeTruthy();
      expect(isValid(board)).toBeTruthy();
    })
  })
});
