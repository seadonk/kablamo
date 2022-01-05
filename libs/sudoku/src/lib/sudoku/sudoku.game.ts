/** This file holds the stateful logic needed for a sudoku game */
import {Subject} from "rxjs";
import {
  _,
  BoardSize,
  CellPosition,
  generateBoard,
  getBoardSize,
  getNumCells,
  hash,
  initBoard,
  parseNotes,
  solve,
  stringifyNotes,
  SudokuAction,
  SudokuBoard,
  SudokuHash,
  SudokuNotes,
  SudokuValue
} from "@kablamo/sudoku";

export class SudokuGame {
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


  /** clears the entire board, producing an empty board */
  clear = () => this.initBoard();

  generate = (clues = 25) => this.initBoard(hash(generateBoard(clues)));

  reset = () => this.initBoard(this.getInitHash());

  solve = () => solve(this.board) && this.save();

  save = () => {
    localStorage.setItem('currentBoard', this.getCurrentHash());
    localStorage.setItem('initBoard', this.getInitHash());
    localStorage.setItem('notes', stringifyNotes(this.notes));
    this.update.next();
  };

  load = () => {
    const currentBoard = localStorage.getItem('currentBoard') || undefined;
    const initBoard = localStorage.getItem('initBoard') || undefined;
    const notes = parseNotes(localStorage.getItem('notes')) || undefined;
    this.initBoard(currentBoard,initBoard,notes);
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
    this.save();
  };

  setNote = (pos: CellPosition, value: SudokuValue) => {
    const {r, c} = pos;
    const currentValue = this.board[r][c];
    // don't write notes in completed cells
    if (currentValue || !value) return;

    // init notes;
    this.notes[r] = this.notes[r] ?? [];
    this.notes[r][c] = this.notes[r][c] ?? new Set<SudokuValue>();
    const notes = this.notes[r][c];
    notes.has(value) ? notes.delete(value) : notes.add(value);
    // for now clone notes, so that we trigger change detection in onPush mode;
    this.notes[r][c] = new Set<SudokuValue>([...notes]);
    // this.board[pos.r][pos.c] = value;
    // if (pushToStack) {
    //   this.actions.push({pos: pos, oldValue: currentValue, newValue: value});
    // }
    this.save();
  };

  isPositionLocked = (pos: CellPosition): boolean =>
    pos && !!this.initialBoard[pos.r][pos.c];

  getPositionValue = (pos: CellPosition): SudokuValue =>
    pos && this.board[pos.r][pos.c];
}
