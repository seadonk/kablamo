import {Component, HostListener} from '@angular/core';
import {SudokuService} from '../../services/sudoku.service';
import {Settings, SettingsService} from '../../services/settings.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {getCellPositionByIndex, SudokuValue} from '@kablamo/utils';

@Component({
  selector: 'sudoku-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  settingsForm: FormGroup;

  get settings(): Settings {
    return this.settingsService.settings;
  }

  @HostListener('keydown.control.z') undo = () => this.sudokuService.undo();
  @HostListener('keydown.control.y') redo = () => this.sudokuService.redo();
  @HostListener('window:keydown', ['$event']) handleKeyboardEvent = (
    event: KeyboardEvent
  ) => this.handleKeyboardNavigation(event) || this.handleInputEvent(event);

  constructor(
    public sudokuService: SudokuService,
    public settingsService: SettingsService,
    private fb: FormBuilder
  ) {
    const group = {};
    for (let key in settingsService.settings) {
      group[key] = [''];
    }
    this.settingsForm = fb.group(group);
    this.settingsForm.setValue(this.settings);
    this.settingsForm.valueChanges.subscribe((t) =>
      this.settingsService.setState(t)
    );
  }

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
    if (this.settings.notesMode) {
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
