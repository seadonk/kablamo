import {Component, HostListener} from '@angular/core';
import {getCellPositionByIndex, SudokuGame, SudokuValue,} from '@kablamo/sudoku';
import {SettingsService} from '../../services/settings.service';

/** handles all keyboard/touch inputs for the game */
@Component({
  selector: 'sudoku-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss'],
})
export class InputsComponent {
  @HostListener('keydown.control.z') undo = () => this.sudokuService.undo();
  @HostListener('keydown.control.y') redo = () => this.sudokuService.redo();
  @HostListener('window:keydown', ['$event']) handleKeyboardEvent = (
    event: KeyboardEvent
  ) => this.handleKeyboardNavigation(event) || this.handleInputEvent(event);

  constructor(
    public sudokuService: SudokuGame,
    public settingsService: SettingsService
  ) {}

  numberButtonInput = (i) => this.handleInputEvent({ key: i });

  // returns true if the keyboard was used to modify a cell value
  private handleInputEvent(
    event: KeyboardEvent | { key: string; code?: string }
  ): boolean {
    // ignore non numeric/deletion keys
    if (
      !+event.key &&
      !['Numpad0', 'Backspace', 'Space', 'Delete', '0'].includes(event.code)
    )
      return false;

    const newValue: SudokuValue = +event.key ? +event.key : 0;
    if (this.settingsService.settings.notesMode) {
      this.sudokuService.setNote(this.sudokuService.selectedPosition, newValue);
    } else {
      this.sudokuService.setValue(
        this.sudokuService.selectedPosition,
        newValue
      );
    }
    return true;
  }

  // returns true if a keyboard navigation occurred
  private handleKeyboardNavigation(event: KeyboardEvent): boolean {
    if (this.sudokuService.selectedPosition == null) {
      this.sudokuService.selectedPosition = { r: 0, c: 0 };
      return true;
    }
    const { c: columns } = this.sudokuService.boardSize;
    let index =
      this.sudokuService.selectedPosition.r * columns +
      this.sudokuService.selectedPosition.c;
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
    if (index < 0) index += this.sudokuService.numCells;
    this.sudokuService.selectedPosition = getCellPositionByIndex(index);
    return true;
  }
}
