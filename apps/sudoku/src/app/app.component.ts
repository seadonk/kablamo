import {Component} from '@angular/core';
import {printBoard} from '@kablamo/utils';
import {SudokuService} from './services/sudoku.service';

@Component({
  selector: 'kablamo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  printBoard = printBoard;
  title = 'sudoku';

  constructor(public sudokuService: SudokuService){
  }
}

