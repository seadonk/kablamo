import {ChangeDetectionStrategy, ChangeDetectorRef, Component,} from '@angular/core';
import {_, CellPosition, isSamePosition, isSameSet, SudokuValue,} from '@kablamo/utils';
import {SudokuService} from '../../services/sudoku.service';
import {Settings, SettingsService} from '../../services/settings.service';

@Component({
  selector: 'sudoku-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  isSameSet = isSameSet;
  get settings(): Settings {
    return this.settingsService.settings;
  }

  constructor(
    public sudokuService: SudokuService,
    public settingsService: SettingsService,
    private cd: ChangeDetectorRef
  ) {
    // manage change detection, since we aren't using inputs here, and have changeDetection set to onPush
    this.settingsService.update.subscribe(() => this.cd.markForCheck());
    this.sudokuService.update.subscribe(() => this.cd.markForCheck());
  }

  selectCell = (cell: CellPosition) =>
    (this.sudokuService.selectedPosition = cell);

  isSelected = (cell: CellPosition): boolean =>
    this.sudokuService.selectedPosition &&
    isSamePosition(this.sudokuService.selectedPosition, cell);

  highlightCell = (cell: CellPosition, value: SudokuValue): boolean => {
    if (!(this.settings.highlightNumber && this.sudokuService.selectedPosition))
      return false;
    if (
      value !=
      this.sudokuService.getPositionValue(this.sudokuService.selectedPosition)
    )
      return false;
    return !(value === _ && !this.settings.highlightBlanks);
  };

  // trickery to not have to initialize every note position
  getNotes = ({ r, c }: CellPosition) =>
    this.sudokuService.notes &&
    this.sudokuService.notes[r] &&
    this.sudokuService.notes[r][c];
}
