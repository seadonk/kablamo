import {Component, Input} from '@angular/core';

@Component({
  selector: 'ff-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent {
  @Input() number: number;
  answers = [0];

  constructor() {
    this.number = 4;
  }

  onComplete = () => this.answers.push(this.answers.length);
}
