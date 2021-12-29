import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {
  _,
  BoardSize,
  CellPosition,
  getBoardSize,
  getCellPositionByIndex,
  getNumCells,
  isSameSet,
  SudokuValue
} from "@kablamo/utils";
import {SudokuService} from "../../services/sudoku.service";

@Component({
  selector: 'sudoku-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  selectedPosition: CellPosition;
  valid: boolean;
  solved: boolean;
  boardSize: BoardSize;
  numCells: number;
  notesMode: boolean;
  showNotes: boolean;
  highlightNumber: boolean = true;
  highlightSets: boolean = true;
  highlightBlanks: boolean = false;
  isSameSet = isSameSet;

  @HostListener('keydown.control.z') undo = () => this.sudokuService.undo();
  @HostListener('keydown.control.y') redo = () => this.sudokuService.redo();
  @HostListener('window:keydown', ['$event']) handleKeyboardEvent = (event: KeyboardEvent) => this.handleKeyboardNavigation(event) || this.handleInputEvent(event);

  constructor(public sudokuService: SudokuService) {
    this.boardSize = getBoardSize(this.sudokuService.board);
    this.numCells = getNumCells(this.sudokuService.board);
  }

  // returns true if the keyboard was used to modify a cell value
  private handleInputEvent(event: KeyboardEvent): boolean {
    // ignore non numeric/deletion keys
    if (!+event.key && !['Numpad0', 'Backspace', 'Space', 'Delete', '0'].includes(event.code))
      return false;

    const newValue: SudokuValue = +event.key ? +event.key : 0;
    this.sudokuService.setValue(this.selectedPosition, newValue);
    // this.analyzeBoard();
    return true;
  }

  // returns true if a keyboard navigation occurred
  private handleKeyboardNavigation(event: KeyboardEvent): boolean {
    if (this.selectedPosition == null) {
      this.selectedPosition = {r: 0, c: 0};
      return true;
    }
    const {c: columns} = this.boardSize;
    let index = this.selectedPosition.r * columns + this.selectedPosition.c;
    switch (event.key) {
      case 'ArrowRight':
        index = (index + 1) % this.numCells;
        break;
      case 'ArrowLeft':
        index = (index - 1) % this.numCells;
        break;
      case 'ArrowUp':
        index = (index - columns) % this.numCells;
        break;
      case 'ArrowDown':
        index = (index + columns) % this.numCells;
        break;
      default:
        return false;
    }
    if (index < 0)
      index += this.numCells;
    this.selectedPosition = getCellPositionByIndex(index);
    return true;
  }

  selectCell = (cell: CellPosition) => this.selectedPosition = cell;

  isSelected = (cell: CellPosition): boolean => {
    const {selectedPosition: s} = this;
    return s && s.r === cell.r && s.c === cell.c;
  }

  highlightCell = (cell: CellPosition, value: SudokuValue): boolean => {
    if (!(this.highlightNumber && this.selectedPosition))
      return false;
    if (value != this.sudokuService.getPositionValue(this.selectedPosition))
      return false;
    if (value === _ && !this.highlightBlanks)
      return false;
    return true;
  }
}
