import {Component, HostListener} from '@angular/core';
import {
  BoardSize,
  Examples,
  getBoardSize,
  getCellPositionByIndex,
  getCellRegionByPosition,
  getNumCells,
  hash,
  initBoard,
  isCellInRegion,
  isSolved,
  isValid,
  solve,
  SudokuBoard,
  SudokuHash,
  SudokuValue
} from "@kablamo/utils";

@Component({
  selector: 'sudoku-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  board: SudokuBoard;
  cells: SudokuValue[];
  selected: number;
  valid: boolean;
  solveable: boolean;
  solved: boolean;
  boardSize: BoardSize;
  numCells: number;

  constructor() {
    this.load();
    this.boardSize = getBoardSize(this.board);
    this.numCells = getNumCells(this.board);
    this.analyzeBoard();
    this.cells = this.board.flat();
  }

  updateBoardFromCells = (cells: number[]) => this.board = initBoard(cells && cells.map(t => t).join(''));
  updateCellsFromBoard = (board: SudokuBoard) => this.cells = board.flat();

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.selected == null) {
      this.selected = 0;
      return;
    }
    const {c: columns} = this.boardSize;
    switch (event.key) {
      case 'ArrowRight':
        this.selected = (this.selected + 1) % this.numCells;
        break;
      case 'ArrowLeft':
        this.selected = (this.selected - 1) % this.numCells;
        break;
      case 'ArrowUp':
        this.selected = (this.selected - columns) % this.numCells;
        break;
      case 'ArrowDown':
        this.selected = (this.selected + columns) % this.numCells;
        break;
    }
    if (this.selected < 0)
      this.selected += this.numCells;
  }

  initBoard = (hash?: SudokuHash) => {
    this.board = hash ? initBoard(hash) : Examples.easyPreset;
    this.updateCellsFromBoard(this.board);
    this.save(this.board);
  }

  selectCell = (i: number) => this.selected = i;

  onValueChanged = (i: number, $event: SudokuValue) => {
    this.cells[i] = $event;
    this.updateBoardFromCells(this.cells);
    this.save(this.board);
    this.analyzeBoard();
  }

  analyzeBoard = () => {
    this.valid = isValid(this.board);
    this.solved = isSolved(this.board);
    this.solveable = isSolved(this.board);
  }

  /** returns true if the indexed cell is part of the same set as the selected cell */
  isSameSet = (i: number): boolean => {
    if (!this.selected)
      return false;
    const position = getCellPositionByIndex(i);
    const selected = getCellPositionByIndex(this.selected);
    const sameRow = selected.r === position.r;
    const sameCol = selected.c === position.c;
    if (sameRow || sameCol)
      return true;
    return false;
    // TODO: this is slow, speed it up!
    // check region
    const selectedRegion = getCellRegionByPosition(selected);
    return isCellInRegion(selectedRegion, position);
  }

  solve = () => solve(this.board) && this.updateCellsFromBoard(this.board);

  reset = () => this.updateCellsFromBoard(Examples.easyPreset);

  clear = () =>  this.updateCellsFromBoard(initBoard());

  save = (board: SudokuBoard) => localStorage.setItem('board', hash(board));
  load = () => this.initBoard(localStorage.getItem('board'));
}
