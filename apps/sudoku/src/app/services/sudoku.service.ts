import {Injectable} from '@angular/core';
import {
  CellPosition,
  generateBoard,
  hash,
  initBoard,
  solve,
  SudokuBoard,
  SudokuHash,
  SudokuValue
} from "@kablamo/utils";

/**
 * This service will maintain the state of a sudoku board / game
 * as opposed to the utility logic which is stateless.
 */
@Injectable({
  providedIn: 'root'
})
export class SudokuService {
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

  /** initializes the board from a given hash */
  private initBoard = (boardHash?: SudokuHash, initBoardHash?: SudokuHash) => {
    this.board = initBoard(boardHash);
    this.initialBoard = initBoard(initBoardHash ?? hash(this.board));
    this.save();
  }

  /** Gets the hash of the board in its current state */
  getCurrentHash = () => hash(this.board);
  /** Gets the hash of the board in its initial state */
  getInitHash = () => hash(this.initialBoard);

  /** clears the entire board, producing an empty board */
  clear = () => this.initBoard()

  generate = (clues = 25) => this.initBoard(hash(generateBoard(clues)))

  reset = () => this.initBoard(this.getInitHash());

  solve = () => solve(this.board);

  save = () => {
    localStorage.setItem('currentBoard', this.getCurrentHash());
    localStorage.setItem('initBoard', this.getInitHash());
  }

  load = () => this.initBoard(localStorage.getItem('currentBoard'), localStorage.getItem('initBoard'));

  /** a stack of actions */
  actions: { pos: CellPosition, oldValue: SudokuValue, newValue: SudokuValue }[] = [];
  /** a stack of actions that have been undone */
  undoActions: { pos: CellPosition, oldValue: SudokuValue, newValue: SudokuValue }[] = [];

  undo = () => {
    const action = this.actions.pop();
    if (!action) return;
    this.setValue(action.pos, action.oldValue, false);
    this.undoActions.push(action);
  }

  redo = () => {
    const action = this.undoActions.pop();
    if (!action) return;
    this.setValue(action.pos, action.newValue, false);
    this.actions.push(action);
  }

  /**
   * Writes the value to the position in the board
   * @param pos the cell being changed
   * @param value the new value
   * @param pushToStack if true this action will be recorded in the undo/redo history
   */
  setValue = (pos: CellPosition, value: SudokuValue, pushToStack = true) => {
    const currentValue = this.board[pos.r][pos.c];
    if (this.isPositionLocked(pos) || currentValue === value)
      return;

    const x = this.initialBoard;
    this.board[pos.r][pos.c] = value;
    console.log(x);
    console.log(this.board);
    if (pushToStack) {
      this.actions.push({pos: pos, oldValue: currentValue, newValue: value});
    }
    this.save();
  }

  isPositionLocked = (pos: CellPosition): boolean => pos && !!this.initialBoard[pos.r][pos.c];

  getIndexByPosition = (pos: CellPosition) => pos && pos.r * this.board[0].length + pos.c;

  getPositionValue = (pos: CellPosition): SudokuValue => pos && this.board[pos.r][pos.c];
}
