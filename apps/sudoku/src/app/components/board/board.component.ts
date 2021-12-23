import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {
  _,
  BoardSize,
  CellPosition,
  Examples,
  generateBoard,
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
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  board: SudokuBoard;
  cells: SudokuValue[];
  selected: number;
  selectedPosition: CellPosition;
  valid: boolean;
  solveable: boolean;
  solved: boolean;
  boardSize: BoardSize;
  numCells: number;
  lockedCells: number[];
  boardHash: SudokuHash;
  notesMode: boolean;
  showNotes: boolean;

  highlightNumber: boolean = true;
  highlightSets: boolean = true;
  sameSetCells: CellPosition[];

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
    if (this.handleKeyboardNavigation(event))
      return;
    this.handleInputEvent(event);
  }

  // returns true if the keyboard was used to modify a cell value
  private handleInputEvent(event: KeyboardEvent): boolean {
    // ignore if no editable cell selected
    if (this.selected == null || this.lockedCells.includes(this.selected))
      return false;

    // ignore non numeric/deletion keys
    if (!+event.key && !['Numpad0', 'Backspace', 'Space', 'Delete', '0'].includes(event.code))
      return false;

    const newValue: SudokuValue = +event.key ? +event.key : 0;
    const currValue = this.cells[this.selected];

    if (newValue === currValue)
      return false;

    this.onValueChanged(this.selected, newValue);
    return true;
  }

  // returns true if a keyboard navigation occurred
  private handleKeyboardNavigation(event: KeyboardEvent): boolean {
    if (this.selected == null) {
      this.selected = 0;
      this.selectedPosition = getCellPositionByIndex(this.selected);
      return true;
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
      default:
        return false;
    }
    if (this.selected < 0)
      this.selected += this.numCells;
    this.selectedPosition = getCellPositionByIndex(this.selected);
    return true;
  }

  getCellsList = (cells: number[]): number[] => cells.map((t, i) => ({
    value: t,
    index: i
  })).filter(t => t.value).map(t => t.index);

  initBoard = (boardHash?: SudokuHash, lockedCells?: number[]) => {
    this.board = boardHash ? initBoard(boardHash) : Examples.easyPreset;
    this.boardHash = hash(this.board);
    this.updateCellsFromBoard(this.board);
    this.lockedCells = lockedCells ?? this.getCellsList(this.cells);
    this.save(this.board);
  }

  selectCell = (i: number) => this.selected = i;
  selectCell2 = (cell: CellPosition) => {
    this.selected = cell && cell.r * 9 + cell.c;
    this.selectedPosition = cell;
  }

  onValueChanged = (i: number, $event: SudokuValue) => {
    console.log('onValueChanged', i, $event);
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

  isLocked = (i: number): boolean => this.lockedCells.includes(i);

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
    return !!this.sameSetCells.find(t => position);
    // return false;
    // TODO: this is slow, speed it up!
    // check region
    // const selectedRegion = getCellRegionByPosition(selected);
    // return isCellInRegion(selectedRegion, position);
  }

  isSameSet2 = (cell: CellPosition): boolean => {
    // console.log('isSameSet2', cell);
    return this.selectedPosition && (
      this.selectedPosition?.r === cell.r ||
      this.selectedPosition?.c === cell.c ||
      isCellInRegion(getCellRegionByPosition(this.selectedPosition), cell));
  }

  solve = () => solve(this.board) && this.updateCellsFromBoard(this.board);

  /** clears all editable cells */
  reset = () => {
    this.updateCellsFromBoard(this.board);
    this.cells.map((v,i) => i).filter(i => !this.lockedCells.includes(i)).forEach(i => this.cells[i] = _);
    this.updateBoardFromCells(this.cells);
  }

  /** clears all cells */
  clear = () => {
    this.updateCellsFromBoard(initBoard());
    this.updateBoardFromCells(this.cells);
  }

  generate = () => this.initBoard(hash(generateBoard(25)));

  save = (board: SudokuBoard) => {
    localStorage.setItem('board', hash(board));
    localStorage.setItem('locked', JSON.stringify(this.lockedCells));
  }
  load = () => {
    const lockedCells = JSON.parse(localStorage.getItem('locked'));
    this.initBoard(localStorage.getItem('board'), lockedCells);
  }

  getBoardHash = () => hash(this.board);
}
