import {Component, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
import {SudokuValue} from "@kablamo/utils";

@Component({
  selector: 'sudoku-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {

  @HostBinding('class')
  get class() {
    let result = '';
    if (this.selected) {
      result += ' --selected';
    } else if (this.highlightNumber) {
      result += ' --highlightNumber';
    } else if (this.highlightSet) {
      result += ' --highlightSet';
    }
    return result;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.selected)
      return;
    if (isFinite(+event.key)) {
      return this.valueChanged.emit(+event.key);
    }
    if (['Backspace', 'Space', 'Delete'].includes(event.code)) {
      return this.valueChanged.emit(0);
    }
  }

  @Input() selected: boolean;
  @Input() highlightNumber: boolean;
  /** same row,column, or region */
  @Input() highlightSet: boolean;

  @Output() valueChanged = new EventEmitter<SudokuValue>();

}
