/** This file holds the stateful logic needed for a sudoku game */
import {Subject} from "rxjs";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  _,
  BoardSize,
  CellPosition,
  clearInvalidNotes,
  fillValidNotes,
  generateBoard,
  getBoardSize,
  getInvalidMap,
  getNumCells,
  hash,
  initBoard,
  parseNotes,
  solve,
  solveCell,
  stringifyNotes,
  SudokuAction,
  SudokuBoard,
  SudokuHash,
  SudokuNotes,
  SudokuValue,
  toggleNote
} from "@kablamo/sudoku";

export class SudokuGame {
  defaultClues = 30;

  /** indicates a long task is running */
  loading = new Subject<boolean>();
  private invalidMap: SudokuBoard = [];

  update = new Subject<void>();
  private _selectedPosition: CellPosition | undefined;
  get selectedPosition(): CellPosition | undefined {
    return this._selectedPosition;
  }

  set selectedPosition(value: CellPosition | undefined) {
    this._selectedPosition = value;
    this.update.next();
  }

  boardSize: BoardSize = {r: 0, c: 0};
  numCells = 0;

  private _autoClearNotes = false;
  /** automatically clear any note values which are or become invalid */
  get autoClearNotes(): boolean {
    return this._autoClearNotes;
  }

  set autoClearNotes(value: boolean) {
    this._autoClearNotes = value;
    if (value) {
      this.clearInvalidNotes();
      this.save();
    }
  }

  private _autoFillNotes = false;
  /** automatically fill in all valid note values */
  get autoFillNotes(): boolean {
    return this._autoFillNotes;
  }

  set autoFillNotes(value: boolean) {
    this._autoFillNotes = value;
    if (value) {
      this.fillValidNotes();
    }
  }

  /** the original board containing only clues */
  private initialBoard: SudokuBoard = [];
  private _board: SudokuBoard = [];
  get board(): SudokuBoard {
    return this._board;
  }

  private set board(value: SudokuBoard) {
    this._board = value;
  }

  private _notes: SudokuNotes = [[]];
  get notes(): SudokuNotes {
    return this._notes;
  }

  private set notes(value: SudokuNotes) {
    this._notes = value;
  }

  constructor() {
    this.load();
  }

  /** initializes the board from a given hash */
  private initBoard = (boardHash?: SudokuHash, initBoardHash?: SudokuHash, notes?: SudokuNotes) => {
    this.board = initBoard(boardHash);
    this.initialBoard = initBoard(initBoardHash ?? hash(this.board));
    this.notes = notes ?? [[]];
    this.boardSize = getBoardSize(this.board);
    this.numCells = getNumCells(this.board);
    this.actions = [];
    this.undoActions = [];
    this.updateValidity();
    this.fillValidNotes() || this.clearInvalidNotes();
    this.save();
  };

  /** Gets the hash of the board in its current state */
  getCurrentHash = () => hash(this.board);
  /** Gets the hash of the board in its initial state */
  getInitHash = () => hash(this.initialBoard);

  /** clear any notes that would be invalid in their sets */
  clearInvalidNotes = () => this.autoClearNotes && clearInvalidNotes(this.board, this.notes);

  /** fill in all valid note values, returns true if autoFillNotes is true  */
  fillValidNotes = (): boolean => {
    if(!this.autoFillNotes) return false;
    fillValidNotes(this.board, this.notes);
    return true;
  }

  /** clears the entire board, producing an empty board */
  clear = () => this.initBoard();

  generate = async (clues?: number) => {
    const numClues = clues ?? this.defaultClues;
    this.loading.next(true);
    await new Promise(resolve => {
      setTimeout(() => {
        this.initBoard(hash(generateBoard(numClues)));
        resolve(true);
      }, 1000);
    });
    this.loading.next(false);
  }

  reset = () => this.initBoard(this.getInitHash());

  solve = async () => {
    this.loading.next(true);
    await new Promise(resolve => {
      setTimeout(() => {
        if(solve(this.board)) {
          this.save();
          this.updateValidity();
        }
        resolve(true);
      }, 1000);
    });
    this.loading.next(false);
  }

  /** attempts to set a valid and solveable value for the selected position */
  hint = async () => {
    const pos = this.selectedPosition;
    if (!pos || this.getPositionValue(pos)) return;

    this.loading.next(true);
    await solveCell(pos, this.getCurrentHash())
      .then((solvedValue) => this.setValue(pos, solvedValue))
      .catch((err) => alert(err))
      .finally(() => this.loading.next(false));
  };

  save = () => {
    localStorage.setItem('currentBoard', this.getCurrentHash());
    localStorage.setItem('initBoard', this.getInitHash());
    localStorage.setItem('notes', stringifyNotes(this.notes));
    this.update.next();
  };

  load = () => {
    const currentBoard = localStorage.getItem('currentBoard') || undefined;
    const initBoard = localStorage.getItem('initBoard') || undefined;
    const notes = parseNotes(localStorage.getItem('notes'));
    this.initBoard(currentBoard, initBoard, notes);
  };

  /** a stack of actions */
    // eslint-disable-next-line @typescript-eslint/member-ordering
  actions: SudokuAction[] = [];
  /** a stack of actions that have been undone */
    // eslint-disable-next-line @typescript-eslint/member-ordering
  undoActions: SudokuAction[] = [];

  undo = () => {
    const action = this.actions.pop();
    if (!action) return;
    this.setValue(action.pos, action.oldValue, false);
    this.undoActions.push(action);
  };

  redo = () => {
    const action = this.undoActions.pop();
    if (!action) return;
    this.setValue(action.pos, action.newValue, false);
    this.actions.push(action);
  };

  /**
   * Writes the value to the position in the board
   * @param pos the cell being changed
   * @param value the new value
   * @param pushToStack if true this action will be recorded in the undo/redo history
   */
  setValue = (pos: CellPosition, value: SudokuValue, pushToStack = true) => {
    const currentValue = this.board[pos.r][pos.c];
    if (this.isPositionLocked(pos)) return;

    // if value is already set, toggle off
    this.board[pos.r][pos.c] = currentValue === value ? _ : value;
    if (pushToStack) {
      this.actions.push({pos: pos, oldValue: currentValue, newValue: value});
      this.undoActions = [];
    }
    this.selectedPosition = pos;
    this.fillValidNotes() || this.clearInvalidNotes();
    this.updateValidity();
    this.save();
  };

  setNote = (pos: CellPosition, value: SudokuValue) => {
    const currentValue = this.getPositionValue(pos);
    // don't write notes in completed cells
    if (currentValue || !value) return;

    toggleNote(pos,value,this.notes);
    this.fillValidNotes() || this.clearInvalidNotes();
    this.save();
  };

  isPositionLocked = (pos: CellPosition): boolean =>
    pos && !!this.initialBoard[pos.r][pos.c];

  getPositionValue = (pos: CellPosition): SudokuValue =>
    pos && this.board[pos.r][pos.c];

  isPositionInvalid = (pos: CellPosition): boolean => pos && !!this.board[pos.r][pos.c] && !this.invalidMap[pos.r][pos.c];

  private updateValidity = () => this.invalidMap = getInvalidMap(this.board);
}
