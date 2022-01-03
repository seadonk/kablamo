import {Injectable} from '@angular/core';
import {
  _,
  BoardSize,
  CellPosition,
  generateBoard,
  getBoardSize,
  getNumCells,
  hash,
  initBoard,
  solve,
  SudokuBoard,
  SudokuHash,
  SudokuNotes,
  SudokuValue,
} from '@kablamo/sudoku';
import {Subject} from 'rxjs';

/**
 * This service will maintain the state of a sudoku board / game
 * as opposed to the utility logic which is stateless.
 */
@Injectable({
  providedIn: 'root',
})
export class SudokuService {
  update = new Subject<void>();
  private _selectedPosition: CellPosition;
  get selectedPosition(): CellPosition {
    return this._selectedPosition;
  }

  set selectedPosition(value: CellPosition) {
    this._selectedPosition = value;
    this.update.next();
  }

  valid: boolean;
  solved: boolean;
  boardSize: BoardSize;
  numCells: number;

  constructor() {
    this.load();
  }

  /** the original board containing only clues */
  private initialBoard: SudokuBoard;
  private _board: SudokuBoard;
  get board(): SudokuBoard {
    return this._board;
  }

  private set board(value: SudokuBoard) {
    this._board = value;
  }

  private _notes: SudokuNotes;
  get notes(): SudokuNotes {
    return this._notes;
  }

  private set notes(value: SudokuNotes) {
    this._notes = value;
  }

  /** initializes the board from a given hash */
  private initBoard = (boardHash?: SudokuHash, initBoardHash?: SudokuHash) => {
    this.board = initBoard(boardHash);
    this.initialBoard = initBoard(initBoardHash ?? hash(this.board));
    // sets are not serializable, so convert from array
    this.notes = (JSON.parse(localStorage.getItem('notes')) ?? [[]]).map((r) =>
      r?.map((c) => new Set<SudokuValue>(c))
    );
    this.boardSize = getBoardSize(this.board);
    this.numCells = getNumCells(this.board);
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
    // sets are not serializable, so convert to array
    localStorage.setItem(
      'notes',
      JSON.stringify(this.notes.map((r) => r?.map((c) => [...c])))
    );
    this.update.next();
  };

  load = () => {
    this.initBoard(
      localStorage.getItem('currentBoard'),
      localStorage.getItem('initBoard')
    );
  };

  /** a stack of actions */
  actions: {
    pos: CellPosition;
    oldValue: SudokuValue;
    newValue: SudokuValue;
  }[] = [];
  /** a stack of actions that have been undone */
  undoActions: {
    pos: CellPosition;
    oldValue: SudokuValue;
    newValue: SudokuValue;
  }[] = [];

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
      this.actions.push({ pos: pos, oldValue: currentValue, newValue: value });
    }
    this.save();
  };

  setNote = (pos: CellPosition, value: SudokuValue) => {
    const { r, c } = pos;
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
