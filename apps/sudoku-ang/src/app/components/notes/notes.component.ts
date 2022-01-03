import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SudokuNote} from '@kablamo/sudoku';

@Component({
  selector: 'sudoku-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesComponent {
  @Input() notes: SudokuNote;
}
