import {ChangeDetectionStrategy, Component, HostBinding, Input,} from '@angular/core';
import {SudokuNote, SudokuValue} from '@kablamo/sudoku';

@Component({
  selector: 'sudoku-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

    if (this.locked) {
      result += ' --locked';
    }
    return result;
  }

  // allow cells to be focused
  @HostBinding('tabIndex') tabIndex = 0;

  /** currently focused cell */
  @Input() selected: boolean;
  /** matches the selected number */
  @Input() highlightNumber: boolean;
  /** same row,column, or region */
  @Input() highlightSet: boolean;
  /** this is one of the clues, and is locked from editing */
  @Input() locked: boolean;
  @Input() value: SudokuValue;
  @Input() notes: SudokuNote;
  @Input() showNotes: boolean;
}
