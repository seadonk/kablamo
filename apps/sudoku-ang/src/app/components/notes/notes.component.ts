import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {SudokuGame, SudokuNote} from '@kablamo/sudoku';

@Component({
  selector: 'sudoku-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesComponent {
  @Input() notes: SudokuNote;

  constructor(private sudokuGame: SudokuGame, private cd: ChangeDetectorRef) {
    sudokuGame.update.subscribe(() => cd.markForCheck());
  }
}
