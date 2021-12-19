import {Injectable} from '@angular/core';
import {initBoard, SudokuBoard} from "@kablamo/utils";

@Injectable({
  providedIn: 'root'
})
export class SudokuService {

  private _board: SudokuBoard = initBoard();
  get board() {
    return this._board;
  }
}
