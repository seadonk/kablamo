import {Component} from '@angular/core';
import {SudokuGame} from '@kablamo/sudoku';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'sudoku-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent {
  constructor(
    public sudokuService: SudokuGame,
    public settingsService: SettingsService
  ) {}
}
