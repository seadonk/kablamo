import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, copyArrayItem, moveItemInArray} from "@angular/cdk/drag-drop";
import {Equation, mathEvaluateGuess, Operators} from "../common";

@Component({
  selector: 'ff-puzzle-row',
  templateUrl: './puzzle-row.component.html',
  styleUrls: ['./puzzle-row.component.scss']
})
export class PuzzleRowComponent implements OnInit{
  isNaN = isNaN;
  Operators = Operators;
  calculatedAnswer: number;
  @Input() answer: number | undefined;
  @Input() number: number;
  private _equation: Equation;
  @Input()
  get equation():Equation{
    return this._equation;
  }
  set equation(value: Equation){
    this._equation = value;
    console.log('set equation');
  }

  /** emits the valid equation as a string */
  @Output() completed = new EventEmitter<Equation>();

  get equationText(): string {
    return this.equation && this.equation.join('');
  }

  get solved(): boolean {
    return !isNaN(this.calculatedAnswer) && this.calculatedAnswer === this.answer;
  }

  @HostBinding('class')
  get class() {
    return this.solved ? '--success' : '';
  }

  ngOnInit(){
    this.calculatedAnswer = mathEvaluateGuess(this.equationText);
  }

  updateGuess() {
    this.calculatedAnswer = mathEvaluateGuess(this.equationText);
    if (this.solved) {
      this.completed.emit(this.equation);
    }
  }

  drop(event: CdkDragDrop<Equation>) {
    const moveItem = () => moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    const copyItem = () => copyArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    // don't remove items, if they are being dragged from another container, because they don't exist in this
    // container for them to be removed.
    const isSameContainer = event.previousContainer === event.container;
    const removeItem = () => isSameContainer && event.container.data.splice(event.previousIndex, 1);

    if (!event.isPointerOverContainer) {
      removeItem();
    } else {
      if (event.previousContainer === event.container) {
        moveItem();
      } else {
        copyItem();
      }
      this.updateGuess()
    }
  }

  inputsDropListEnterPredicate: (drag: CdkDrag, drop: CdkDropList) => boolean = () => false;
}
