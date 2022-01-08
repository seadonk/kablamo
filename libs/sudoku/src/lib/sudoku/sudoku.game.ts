/** This file holds the stateful logic needed for a sudoku game */
import {Subject} from "rxjs";
import {
  _,
  BoardSize,
  CellPosition,
  clearInvalidNotes,
  generateBoard,
  getBoardSize,
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
  /** indicates a long task is running */
  loading = new Subject<boolean>();

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

  private _autoClear = false;
  get autoClear(): boolean {
    return this._autoClear;
  }

  set autoClear(value: boolean) {
    this._autoClear = value;
    if (value) {
      this.clearInvalidNotes();
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
    this.save();
  };

  /** Gets the hash of the board in its current state */
  getCurrentHash = () => hash(this.board);
  /** Gets the hash of the board in its initial state */
  getInitHash = () => hash(this.initialBoard);

  /** clear any notes that would be invalid in their sets */
  clearInvalidNotes = () => {
    this.autoClear && clearInvalidNotes(this.board, this.notes);
    this.save();
  }

  /** clears the entire board, producing an empty board */
  clear = () => this.initBoard();

  generate = async (clues = 25) => {
    this.loading.next(true);
    await new Promise(resolve => {
      setTimeout(() => {
        this.initBoard(hash(generateBoard(clues)));
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
        solve(this.board) && this.save();
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
    this.clearInvalidNotes();
    this.save();
  };

  setNote = (pos: CellPosition, value: SudokuValue) => {
    const currentValue = this.getPositionValue(pos);
    // don't write notes in completed cells
    if (currentValue || !value) return;

    toggleNote(pos,value,this.notes);
    this.clearInvalidNotes();
    this.save();
  };

  isPositionLocked = (pos: CellPosition): boolean =>
    pos && !!this.initialBoard[pos.r][pos.c];

  getPositionValue = (pos: CellPosition): SudokuValue =>
    pos && this.board[pos.r][pos.c];
}
