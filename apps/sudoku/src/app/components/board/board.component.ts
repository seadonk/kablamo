import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener} from '@angular/core';
import {_, CellPosition, getCellPositionByIndex, isSamePosition, isSameSet, SudokuValue} from "@kablamo/utils";
import {SudokuService} from "../../services/sudoku.service";
import {Settings, SettingsService} from "../../services/settings.service";

@Component({
  selector: 'sudoku-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  isSameSet = isSameSet;

  @HostListener('keydown.control.z') undo = () => this.sudokuService.undo();
  @HostListener('keydown.control.y') redo = () => this.sudokuService.redo();
  @HostListener('window:keydown', ['$event']) handleKeyboardEvent = (event: KeyboardEvent) => this.handleKeyboardNavigation(event) || this.handleInputEvent(event);

  get settings(): Settings {
    return this.settingsService.settings;
  }

  constructor(public sudokuService: SudokuService,
              public settingsService: SettingsService,
              private cd: ChangeDetectorRef) {
    // manage change detection, since we aren't using inputs here, and have changeDetection set to onPush
    this.settingsService.update.subscribe(() => this.cd.markForCheck());
    this.sudokuService.update.subscribe(() => this.cd.markForCheck());
  }

  numberButtonInput = i => this.handleInputEvent({key: i});

  // returns true if the keyboard was used to modify a cell value
  private handleInputEvent(event: KeyboardEvent | { key: string, code?: string }): boolean {
    // ignore non numeric/deletion keys
    if (!+event.key && !['Numpad0', 'Backspace', 'Space', 'Delete', '0'].includes(event.code))
      return false;

    const newValue: SudokuValue = +event.key ? +event.key : 0;
    if (this.settings.notesMode) {
      this.sudokuService.setNote(this.sudokuService.selectedPosition, newValue);
    } else {
      this.sudokuService.setValue(this.sudokuService.selectedPosition, newValue);
    }
    return true;
  }

  // returns true if a keyboard navigation occurred
  private handleKeyboardNavigation(event: KeyboardEvent): boolean {
    if (this.sudokuService.selectedPosition == null) {
      this.sudokuService.selectedPosition = {r: 0, c: 0};
      return true;
    }
    const {c: columns} = this.sudokuService.boardSize;
    let index = this.sudokuService.selectedPosition.r * columns + this.sudokuService.selectedPosition.c;
    switch (event.key) {
      case 'ArrowRight':
        index = (index + 1) % this.sudokuService.numCells;
        break;
      case 'ArrowLeft':
        index = (index - 1) % this.sudokuService.numCells;
        break;
      case 'ArrowUp':
        index = (index - columns) % this.sudokuService.numCells;
        break;
      case 'ArrowDown':
        index = (index + columns) % this.sudokuService.numCells;
        break;
      default:
        return false;
    }
    if (index < 0)
      index += this.sudokuService.numCells;
    this.sudokuService.selectedPosition = getCellPositionByIndex(index);
    return true;
  }

  selectCell = (cell: CellPosition) => this.sudokuService.selectedPosition = cell;

  isSelected = (cell: CellPosition): boolean => this.sudokuService.selectedPosition && isSamePosition(this.sudokuService.selectedPosition, cell);

  highlightCell = (cell: CellPosition, value: SudokuValue): boolean => {
    if (!(this.settings.highlightNumber && this.sudokuService.selectedPosition))
      return false;
    if (value != this.sudokuService.getPositionValue(this.sudokuService.selectedPosition))
      return false;
    return !(value === _ && !this.settings.highlightBlanks);
  }

  // trickery to not have to initialize every note position
  getNotes = ({
                r,
                c
              }: CellPosition) => this.sudokuService.notes && this.sudokuService.notes[r] && this.sudokuService.notes[r][c]
}
