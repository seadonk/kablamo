import {Component} from '@angular/core';
import {printBoard} from '@kablamo/sudoku';

@Component({
  selector: 'sudoku-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  printBoard = printBoard;
  title = 'sudoku';

  constructor() {}
}
