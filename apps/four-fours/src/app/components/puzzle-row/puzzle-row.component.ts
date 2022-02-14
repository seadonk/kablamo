import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {getRange} from "@kablamo/utils";
import {evaluate} from "mathjs";

@Component({
  selector: 'ff-puzzle-row',
  templateUrl: './puzzle-row.component.html',
  styleUrls: ['./puzzle-row.component.scss']
})
export class PuzzleRowComponent {
  @Input() answer: number | undefined;
  private _number: number;
  @Input()
  get number(): number {
    return this._number;
  }
  set number(value: number) {
    this._number = value;
    this.guess = getInitialGuess(value);
  }
  @Output() completed = new EventEmitter<void>();

  guess: string;
  calculatedAnswer: number;

  get success():boolean {return this.calculatedAnswer === this.answer;}

  @HostBinding('class')
  get class() {
    return this.success ? '--success' : '';
  }

  constructor() {
    this._number = 0;
    this.answer = 0;
    this.guess = '';
    this.calculatedAnswer = undefined;
  }

  updateGuess($event: any) {
    console.log($event);
    this.calculatedAnswer = mathEvaluateGuess($event);
    if(this.success){
      this.completed.emit();
    }
  }


}

/**
 * Alternative to using eval()
 * @param guess
 * @see https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/eval#never_use_eval!
 */
const evaluateGuess = (guess: string): number | undefined => {
  return Function('"use strict";return (' + guess + ')')();
}
/**
 * Using mathjs
 * @see https://mathjs.org/docs/expressions/parsing.html#evaluate
 * @param guess
 */
const mathEvaluateGuess = (guess: string): number | undefined => {
  return evaluate(guess);
}
const getInitialGuess = (number: number): string => getRange(number - 1).map(() => number).join(" ");
