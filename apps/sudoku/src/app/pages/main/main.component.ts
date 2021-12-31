import {Component} from '@angular/core';
import {SudokuService} from "../../services/sudoku.service";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'sudoku-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  constructor(public sudokuService: SudokuService,
              public settings: SettingsService) {

  }

  getBoardNotes = (): any => this.sudokuService.notes.map(r => r.map(c => [...c]));

}
