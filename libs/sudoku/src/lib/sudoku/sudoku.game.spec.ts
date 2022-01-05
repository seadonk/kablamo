import {
  _,
  areNotesEqual,
  CellPosition,
  Examples,
  getFilledCells,
  hash,
  isSolveable,
  isSolved,
  isSubsetOf,
  stringifyNotes,
  SudokuAction,
  SudokuGame,
  SudokuNotes,
  SudokuValue
} from "@kablamo/sudoku";

describe('Sudoku Game', () => {
  let sudokuGame: SudokuGame;
  beforeEach(() => {
    sudokuGame = new SudokuGame();
  })

  describe('SudokuGame', () => {
      it('should begin as a new empty board', () => {
        expect(sudokuGame.getCurrentHash()).toBe(hash(Examples.emptyBoard));
      })
  })

  describe('initBoard', () => {
    it('should initialize an empty board if no board hash is provided', () => {
      sudokuGame['initBoard'](hash(Examples.easyPreset));
      expect(sudokuGame.board).not.toStrictEqual(Examples.emptyBoard);
      sudokuGame['initBoard']();
      expect(sudokuGame.board).toStrictEqual(Examples.emptyBoard);
    })
    it('should initialize the board with the provided board hash', () => {
      sudokuGame['initBoard'](hash(Examples.easyPreset));
      expect(sudokuGame.board).toStrictEqual(Examples.easyPreset);
    })
    it('should initialize the initialBoard with the hash of the current board if no initBoardHash is provided', () => {
      sudokuGame['initBoard'](hash(Examples.easyPreset));
      expect(sudokuGame.getInitHash()).toStrictEqual(hash(Examples.easyPreset));
    })
    it('should initialize the initialBoard with the provided initBoardHash', () => {
      sudokuGame['initBoard'](hash(Examples.solved), hash(Examples.easyPreset));
      expect(sudokuGame.getInitHash()).toStrictEqual(hash(Examples.easyPreset));
    })
    it('should initialize the notes  with the provided Notes', () => {
      const notes: SudokuNotes = [[new Set<SudokuValue>([1, 4, 5])]];
      sudokuGame['initBoard'](hash(Examples.solved), hash(Examples.easyPreset), notes);
      expect(sudokuGame.notes).toBe(notes);
    })
    it('should initialize the notes as [[]] if none provided', () => {
      const notes: SudokuNotes = [[new Set<SudokuValue>([1, 4, 5])]];
      sudokuGame['initBoard'](hash(Examples.solved), hash(Examples.easyPreset), notes);
      expect(sudokuGame.notes).not.toStrictEqual([[]]);
      sudokuGame['initBoard']();
      expect(sudokuGame.notes).toStrictEqual([[]]);
    })
    it('should set the boardSize', () => {
      sudokuGame['initBoard'](hash(Examples.easyPreset));
      expect(sudokuGame.boardSize).toStrictEqual({r: 9, c: 9});
    })
    it('should set the numCells', () => {
      sudokuGame['initBoard'](hash(Examples.easyPreset));
      expect(sudokuGame.numCells).toBe(81);
    })
    it('should call save after initialization', () => {
      const save = jest.spyOn(sudokuGame, 'save');
      sudokuGame['initBoard']();
      expect(save).toHaveBeenCalledTimes(1);
    })
    it('should clear any existing actions and undoActions', () => {
      sudokuGame['initBoard'](hash(Examples.easyPreset));
      sudokuGame.setValue({r: 2, c: 0}, 9);
      sudokuGame.setValue({r: 2, c: 1}, 9);
      sudokuGame.undo();
      expect(sudokuGame.actions).toHaveLength(1);
      expect(sudokuGame.undoActions).toHaveLength(1);
      sudokuGame['initBoard']();
      expect(sudokuGame.actions).toHaveLength(0);
      expect(sudokuGame.undoActions).toHaveLength(0);
    })
  })

  describe('getCurrentHash', () => {
    it('should return the hash of the current board', () => {
      const boardHash = hash(Examples.emptyBoard);
      sudokuGame['initBoard'](boardHash);
      sudokuGame.setValue({r: 0, c: 0}, 9);
      expect(sudokuGame.getCurrentHash()).toBe(hash(sudokuGame.board));
    })
  })

  describe('getInitHash', () => {
    it('should return the hash of the board in its initial state before user input', () => {
      const boardHash = hash(Examples.emptyBoard);
      sudokuGame['initBoard'](boardHash);
      sudokuGame.setValue({r: 0, c: 0}, 9);
      expect(sudokuGame.getInitHash()).toBe(boardHash);
    })
  })

  describe('clear', () => {
    // overkill test, this one isn't really needed.
    // All of this functionality is tested individually in initBoard
    it('should initialize a blank board and history', () => {
      const notes: SudokuNotes = [[new Set<SudokuValue>([1, 4, 5])]];
      sudokuGame['initBoard'](hash(Examples.solved), hash(Examples.easyPreset), notes);
      sudokuGame.setValue({r: 1, c: 0}, 9);
      sudokuGame.setValue({r: 1, c: 1}, 9);
      sudokuGame.undo();
      expect(sudokuGame.getCurrentHash()).not.toBe(hash(Examples.emptyBoard));
      expect(sudokuGame.getInitHash()).not.toBe(hash(Examples.emptyBoard));
      expect(sudokuGame.actions).not.toHaveLength(0);
      expect(sudokuGame.undoActions).not.toHaveLength(0);
      expect(sudokuGame.notes).not.toStrictEqual([[]]);
      sudokuGame.clear();
      expect(sudokuGame.getCurrentHash()).toBe(hash(Examples.emptyBoard));
      expect(sudokuGame.getInitHash()).toBe(hash(Examples.emptyBoard));
      expect(sudokuGame.actions).toHaveLength(0);
      expect(sudokuGame.undoActions).toHaveLength(0);
      expect(sudokuGame.notes).toStrictEqual([[]]);
    })
    it('should call initBoard with no params, to clear out the game', () => {
      const initBoard = jest.fn();
      sudokuGame['initBoard'] = initBoard;
      sudokuGame.clear();
      expect(initBoard).toHaveBeenCalledTimes(1);
      expect(initBoard).toHaveBeenCalledWith();
    })
  })

  describe('generate', () => {
    it('should generate a solveable board', () => {
      sudokuGame.generate();
      expect(isSolveable(sudokuGame.board)).toBeTruthy();
    })
    it('should generate a board with 25 clues by default', () => {
      sudokuGame.generate();
      expect(getFilledCells(sudokuGame.board)).toBe(25);
    })
    it('should generate a board with the specified number of clues', () => {
      sudokuGame.generate(27);
      expect(getFilledCells(sudokuGame.board)).toBe(27);
    })
    it('should call initBoard', () => {
      const initBoard = jest.fn();
      sudokuGame['initBoard'] = initBoard;
      sudokuGame.generate();
      expect(initBoard).toHaveBeenCalledTimes(1);
    })
  })

  describe('reset', () => {
    const initBoardHash = hash(Examples.easyPreset);
    beforeEach(() => {
      sudokuGame['initBoard'](initBoardHash);
      sudokuGame.setValue({r:1,c:0},9);
      sudokuGame.setValue({r:1,c:0},8);
      sudokuGame.undo();
      sudokuGame.setNote({r:1,c:1}, 2);
      expect(sudokuGame.getCurrentHash()).not.toBe(initBoardHash);
      expect(sudokuGame.actions).not.toHaveLength(0);
      expect(sudokuGame.undoActions).not.toHaveLength(0);
      expect(stringifyNotes(sudokuGame.notes)).not.toBe('[[]]');
    })
    it('should clear any non-locked cells', () => {
      sudokuGame.reset();
      expect(sudokuGame.getPositionValue({r:1,c:0})).toBe(_);
      expect(sudokuGame.getCurrentHash()).toBe(sudokuGame.getInitHash());
    })
    it('should clear the undo/redo history', () => {
      sudokuGame.reset();
      expect(sudokuGame.actions).toHaveLength(0);
      expect(sudokuGame.undoActions).toHaveLength(0);
    })
    it('should clear any notes', () => {
      sudokuGame.reset();
      expect(stringifyNotes(sudokuGame.notes)).toBe('[[]]');
    })
    it('should call initBoard with the initial board hash', () => {
      const initBoard = jest.fn();
      sudokuGame['initBoard'] = initBoard;
      sudokuGame.reset();
      expect(initBoard).toHaveBeenCalledTimes(1);
      expect(initBoard).toHaveBeenCalledWith(initBoardHash)
    })
  })

  describe('solve', () => {
    it('should solve the current board if possible', () => {
      sudokuGame['initBoard'](hash(Examples.easyPreset));
      expect(isSolved(sudokuGame.board)).toBeFalsy();
      sudokuGame.solve();
      expect(isSolved(sudokuGame.board)).toBeTruthy();
      expect(isSubsetOf(Examples.easyPreset, sudokuGame.board));
    })
    it('should do nothing if the current board is not solveable', () => {
      sudokuGame['initBoard'](hash(Examples.invalidRegions));
      expect(isSolved(sudokuGame.board)).toBeFalsy();
      sudokuGame.solve();
      expect(isSolved(sudokuGame.board)).toBeFalsy();
      expect(hash(Examples.invalidRegions)).toBe(sudokuGame.getCurrentHash());
    })
    it('should do nothing if the current board is already solved', () => {
      sudokuGame['initBoard'](hash(Examples.solved));
      expect(isSolved(sudokuGame.board)).toBeTruthy();
      expect(hash(Examples.solved)).toBe(sudokuGame.getCurrentHash());
      sudokuGame.solve();
      expect(hash(Examples.solved)).toBe(sudokuGame.getCurrentHash());
    })
  })

  describe('save', () => {
    const initialBoard = Examples.easyPreset;
    const pos = {r: 2, c: 0};
    beforeEach(() => {
      sudokuGame['initBoard'](hash(initialBoard));
      sudokuGame.setNote(pos, 9);
      sudokuGame.setValue(pos, 6)
    });
    it('should save the currentBoard to localStorage', () => {
      const setItem = jest.spyOn(Storage.prototype, 'setItem');
      sudokuGame.save();
      expect(setItem).toHaveBeenCalledWith('currentBoard', sudokuGame.getCurrentHash());
    })
    it('should save the initialBoard to localStorage', () => {
      const setItem = jest.spyOn(Storage.prototype, 'setItem');
      sudokuGame.save();
      expect(setItem).toHaveBeenCalledWith('initBoard', sudokuGame.getInitHash());
    })
    it('should save the notes to localStorage', () => {
      const setItem = jest.spyOn(Storage.prototype, 'setItem');
      sudokuGame.save();
      expect(setItem).toHaveBeenCalledWith('notes', stringifyNotes(sudokuGame.notes));
    })
  })

  describe('load', () => {
    it('should initialize the board with the "currentBoard" from localStorage', () => {
      const boardHash = hash(Examples.easyPreset);
      const getItem = jest.spyOn(Storage.prototype, 'getItem')
        .mockImplementation(t => t === 'currentBoard' && boardHash || null);
      sudokuGame.load();
      expect(getItem).toHaveBeenCalledWith('currentBoard');
      expect(sudokuGame.getCurrentHash()).toBe(boardHash);
    })
    it('should initialize the board with the "initBoard" from localStorage', () => {
      const boardHash = hash(Examples.easyPreset);
      const getItem = jest.spyOn(Storage.prototype, 'getItem')
        .mockImplementation(t => t === 'initBoard' && boardHash || null);
      sudokuGame.load();
      expect(getItem).toHaveBeenCalledWith('initBoard');
      expect(sudokuGame.getInitHash()).toBe(boardHash);
    })
    it('should initialize the board with the "notes" from localStorage', () => {
      const notes: SudokuNotes = [[new Set<SudokuValue>([1, 4, 5])]];
      const stringifiedNotes = stringifyNotes(notes);
      const getItem = jest.spyOn(Storage.prototype, 'getItem')
        .mockImplementation(t => t === 'notes' && stringifiedNotes || null);
      sudokuGame.load();
      expect(getItem).toHaveBeenCalledWith('notes');
      expect(areNotesEqual(sudokuGame.notes, notes)).toBeTruthy();
    })
    it('should call initBoard', () => {
      const initBoard = jest.fn();
      sudokuGame['initBoard'] = initBoard;
      sudokuGame.load();
      expect(initBoard).toHaveBeenCalledTimes(1);
    })
    it('should call initBoard with loaded values from storage', () => {
      const boardHash = hash(Examples.solved);
      const initBoardHash = hash(Examples.easyPreset);
      const notes: SudokuNotes = [[new Set<SudokuValue>([1, 4, 5])]];
      const stringifiedNotes = stringifyNotes(notes);
      const storage: { [key: string]: any } = {
        currentBoard: boardHash,
        initBoard: initBoardHash,
        notes: stringifiedNotes
      };
      jest.spyOn(Storage.prototype, 'getItem')
        .mockImplementation(t => storage[t]);
      const initBoard = jest.fn();
      sudokuGame['initBoard'] = initBoard;
      sudokuGame.load();
      expect(initBoard).toHaveBeenCalledTimes(1);
      expect(initBoard.mock.calls[0][0]).toBe(boardHash);
      expect(initBoard.mock.calls[0][1]).toBe(initBoardHash);
      expect(areNotesEqual(initBoard.mock.calls[0][2], notes)).toBeTruthy();
    })
  })

  describe('setValue', () => {
    it('should not update the cell if the cell is locked', () => {
      sudokuGame['initBoard'](hash(Examples.easyPreset));
      const pos = {r: 0, c: 0};
      sudokuGame.setValue(pos, 9);
      expect(sudokuGame.getPositionValue(pos)).not.toBe(9);
    })
    it('should clear the cell if the cell is already set to the same value', () => {
      const pos = {r: 1, c: 0};
      sudokuGame.setValue(pos, 9);
      expect(sudokuGame.getPositionValue(pos)).toBe(9);
      sudokuGame.setValue(pos, 9);
      expect(sudokuGame.getPositionValue(pos)).not.toBe(9);
    })
    it('should push to the actions stack if pushToStack is true', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const push = jest.spyOn(sudokuGame.actions, 'push');
      const pos = {r: 1, c: 0};
      sudokuGame.setValue(pos, 9);
      sudokuGame.setValue(pos, 8);
      const expectedAction: SudokuAction = {pos: pos, oldValue: 9, newValue: 8};
      expect(push).toHaveBeenCalledTimes(2);
      expect(sudokuGame.actions).toHaveLength(2);
      expect(sudokuGame.actions.pop()).toStrictEqual(expectedAction);
    })
    it('should clear the undo actions stack if pushToStack is true', () => {
      const pos = {r: 1, c: 0};
      sudokuGame.setValue(pos, 9);
      sudokuGame.undo();
      expect(sudokuGame.undoActions).not.toHaveLength(0);
      sudokuGame.setValue(pos, 9, false);
      expect(sudokuGame.undoActions).not.toHaveLength(0);
      sudokuGame.setValue(pos, 9);
      expect(sudokuGame.undoActions).toHaveLength(0);
    })
  })

  describe('setNote', () => {
    beforeEach(() => {
      sudokuGame['initBoard']();
    })
    it('should add the value to the set of notes for the given cell position if not already added', () => {
      const pos: CellPosition = {r: 1, c: 0};
      sudokuGame.setNote(pos, 9);
      expect(sudokuGame.notes[pos.r][pos.c].size).toBe(1);
      expect(sudokuGame.notes[pos.r][pos.c].has(9)).toBeTruthy();
      sudokuGame.setNote(pos, 8);
      expect(sudokuGame.notes[pos.r][pos.c].size).toBe(2);
      expect(sudokuGame.notes[pos.r][pos.c]).toContain(8);
    })
    it('should clear the value in the set of notes for the given cell position if already added', () => {
      const pos: CellPosition = {r: 1, c: 0};
      sudokuGame.setNote(pos, 9);
      expect(sudokuGame.notes[pos.r][pos.c].size).toBe(1);
      expect(sudokuGame.notes[pos.r][pos.c].has(9)).toBeTruthy();
      sudokuGame.setNote(pos, 9);
      expect(sudokuGame.notes[pos.r][pos.c].size).toBe(0);
    })
    it('should not add a note for a completed cell', () => {
      sudokuGame['initBoard'](hash(Examples.easyPreset));
      const pos: CellPosition = {r: 0, c: 0};
      sudokuGame.setNote(pos, 9);
      expect(sudokuGame.notes).toStrictEqual([[]]);
    })
  })

  describe('isPositionLocked', () => {
    beforeEach(() => {
      // init a solved board using the easyPreset as the initial board.
      sudokuGame['initBoard'](hash(Examples.solved), hash(Examples.easyPreset));
    })
    it('should return true if the initial board contains a value at that position', () => {
      expect(sudokuGame.isPositionLocked({r: 0, c: 0})).toBeTruthy();
    })
    it('should return false if the initial board does not contains a value at that position', () => {
      expect(sudokuGame.isPositionLocked({r: 1, c: 0})).toBeFalsy();
    })
  })

  describe('getPositionValue', () => {
    beforeEach(() => {
      // init a board using the easyPreset as the initial board.
      sudokuGame['initBoard'](hash(Examples.easyPreset));
    })
    it('should return the value at the given position', () => {
      expect(sudokuGame.getPositionValue({r: 0, c: 0})).toBe(3);
      expect(sudokuGame.getPositionValue({r: 1, c: 0})).toBe(_);
    })
  })

  describe('update', () => {
    it('should emit the update observable if save is called', () => {
      const update = jest.spyOn(sudokuGame.update, 'next');
      sudokuGame.save();
      expect(update).toHaveBeenCalledTimes(1);
    })
    it('should emit the update observable if the selectedPosition is set', () => {
      const update = jest.spyOn(sudokuGame.update, 'next');
      sudokuGame.selectedPosition = {r: 1, c: 1};
      expect(update).toHaveBeenCalledTimes(1);
    })
  })

  describe('boardSize', () => {
    it('should show the size of the initialized board', () => {
      sudokuGame['initBoard'](hash(Examples.easyPreset));
      expect(sudokuGame.boardSize).toStrictEqual({r: 9, c: 9});
    })

    it.skip('should show the size of a non-standard (9x9) initialized board', () => {
      sudokuGame['initBoard']('0000000000000000');
      expect(sudokuGame.boardSize).toStrictEqual({r: 4, c: 4});
    })
  })

  describe('numCells', () => {
    it('should be the number of cells in the initialized board', () => {
      sudokuGame['initBoard'](hash(Examples.easyPreset));
      expect(sudokuGame.numCells).toBe(81);
    })
    it.skip('should be the number of cells in a non-standard (9x9) initialized board', () => {
      sudokuGame['initBoard']('0000000000000000');
      expect(sudokuGame.boardSize).toStrictEqual({r: 4, c: 4});
    })
  })

  describe('undo/redo history', () => {
    beforeEach(() => initBoardHack());
    describe('undo', () => {
      let testAction: SudokuAction;
      beforeEach(() => {
        testAction = {pos: {r: 1, c: 1}, oldValue: _, newValue: 9};
        sudokuGame.setValue(testAction.pos, testAction.newValue);
      })
      it('should pop the action off the actions stack', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const pop = jest.spyOn(sudokuGame.actions, 'pop');
        expect(sudokuGame.actions).toHaveLength(1);
        expect(sudokuGame.actions.slice(-1)[0]).toStrictEqual(testAction);
        sudokuGame.undo();
        expect(sudokuGame.actions).toHaveLength(0);
        expect(pop).toHaveBeenCalledTimes(1);
      })
      it('should push the action to the undoActions stack', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const push = jest.spyOn(sudokuGame.undoActions, 'push');
        expect(sudokuGame.undoActions).toHaveLength(0);
        sudokuGame.undo();
        expect(sudokuGame.undoActions).toHaveLength(1);
        expect(sudokuGame.undoActions.slice(-1)[0]).toStrictEqual(testAction);
        expect(push).toHaveBeenCalledTimes(1);
        expect(push).toHaveBeenCalledWith(testAction);
      })
      it('should call setValue with position and oldValue of the undone action', () => {
        const setValue = jest.spyOn(sudokuGame, 'setValue');
        sudokuGame.undo();
        expect(setValue).toHaveBeenCalledTimes(1);
        expect(setValue).toHaveBeenLastCalledWith(testAction.pos, testAction.oldValue, false);
      })
      it('should do nothing if the actions stack is empty', () => {
        sudokuGame.undo();
        expect(sudokuGame.actions).toHaveLength(0);
        expect(sudokuGame.undoActions).toHaveLength(1);
        const setValue = jest.spyOn(sudokuGame, 'setValue');
        sudokuGame.undo();
        expect(setValue).not.toHaveBeenCalled();
        expect(sudokuGame.actions).toHaveLength(0);
        expect(sudokuGame.undoActions).toHaveLength(1);
      })
    })
    describe('redo', () => {
      const testAction: SudokuAction = {pos: {r: 1, c: 1}, oldValue: _, newValue: 9};
      beforeEach(() => {
        sudokuGame = new SudokuGame();
        // somehow the 'should push the action to the actions stack' test is not receiving a blank board.
        // previous tests must be bleeding over into it. clear out the board here to be sure.
        sudokuGame['initBoard']();
        sudokuGame.setValue(testAction.pos, testAction.newValue);
        sudokuGame.undo();
      })
      it('should clear the undoActions stack if a new value is set with pushToStack = true', () => {
        expect(sudokuGame.undoActions).toHaveLength(1);
        sudokuGame.setValue(testAction.pos, testAction.newValue, true);
        expect(sudokuGame.undoActions).toHaveLength(0);
      })
      it('should not clear the undoActions stack if a new value is set with pushToStack = false', () => {
        expect(sudokuGame.undoActions).toHaveLength(1);
        sudokuGame.setValue(testAction.pos, testAction.newValue, false);
        expect(sudokuGame.undoActions).not.toHaveLength(0);
      })
      it('should pop the action off the undoActions stack', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const pop = jest.spyOn(sudokuGame.undoActions, 'pop');
        expect(sudokuGame.undoActions).toHaveLength(1);
        expect(sudokuGame.undoActions.slice(-1)[0]).toStrictEqual(testAction);
        sudokuGame.redo();
        expect(sudokuGame.undoActions).toHaveLength(0);
        expect(pop).toHaveBeenCalledTimes(1);
      })
      it('should push the action to the actions stack', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const push = jest.spyOn(sudokuGame.actions, 'push');
        expect(sudokuGame.actions).toHaveLength(0);
        sudokuGame.redo();
        expect(push).toHaveBeenCalledTimes(1);
        expect(push).toHaveBeenCalledWith(testAction);
      })
      it('should call setValue with position and newValue of the re-done action', () => {
        const setValue = jest.spyOn(sudokuGame, 'setValue');
        sudokuGame.redo();
        expect(setValue).toHaveBeenCalledTimes(1);
        expect(setValue).toHaveBeenLastCalledWith(testAction.pos, testAction.newValue, false);
      })
      it('should do nothing if the undoActions stack is empty', () => {
        sudokuGame.redo();
        expect(sudokuGame.undoActions).toHaveLength(0);
        expect(sudokuGame.actions).toHaveLength(1);
        const setValue = jest.spyOn(sudokuGame, 'setValue');
        sudokuGame.redo();
        expect(setValue).not.toHaveBeenCalled();
        expect(sudokuGame.undoActions).toHaveLength(0);
        expect(sudokuGame.actions).toHaveLength(1);
      })
    })
    describe('actions', () => {
      it('should push every action to the actions stack', () => {
        expect(sudokuGame.actions).toHaveLength(0);
        for (let i = 1; i < 5; i++) {
          const pos = {r: 2, c: i};
          const expectedValue: SudokuAction = {pos: pos, oldValue: _, newValue: 9};
          sudokuGame.setValue(expectedValue.pos, expectedValue.newValue);
          expect(sudokuGame.actions).toHaveLength(i);
          expect(sudokuGame.actions.slice(-1)[0]).toStrictEqual(expectedValue)
        }
      })
    })

    describe('selectedPosition', ()=> {
      it('should be undefined by default', () => {
        expect(sudokuGame.selectedPosition).toBeUndefined();
      })
    })
  })

  // tests are conflicting with eachother somehow, this ensures that there should be no crossover.
  const initBoardHack = () => sudokuGame['initBoard']();
})
