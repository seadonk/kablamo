import {Component, Input} from '@angular/core';
import {
  addProblem,
  clearEquations,
  Equation,
  getHighestStoredAnswer,
  isSolved,
  loadSolutions,
  Solutions,
  storeSolution
} from "../common";

@Component({
  selector: 'ff-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent {
  @Input() number: number;
  solutions: Solutions;
  currentSolutions: { answer: number, equation: Equation }[];

  constructor() {
    this.number = 4;
    this.initSolutions();
  }

  initSolutions = () => {
    this.solutions = loadSolutions();
    if (!this.solutions) {
      this.solutions = {};
      this.incrementAnswer();
    }
    this.currentSolutions = this.getCurrentSolutions();
    // temporary, need to fix typing on solutions
    const current = this.currentSolutions[this.currentSolutions.length - 1];
    if (isSolved(current.answer, current.equation)) {
      this.incrementAnswer();
    }
  }

  getCurrentSolutions(): { answer: number, equation: Equation }[] {
    return Object.keys(this.solutions[this.number]).map((k => ({
      answer: +k, equation: this.solutions[this.number][+k]
    }))).reverse();
  }

  onComplete = (number, answer, equation: Equation) => {
    // only store solved problems
    storeSolution(this.solutions, number, answer, equation);
    // increment the local solutions with an unsolved problem
    this.incrementAnswer();
  }

  incrementAnswer = () => {
    const nextAnswer = getHighestStoredAnswer(this.number, this.solutions) + 1;
    addProblem(this.solutions, this.number, nextAnswer);
    this.currentSolutions = this.getCurrentSolutions();
  }

  reset = () => {
    clearEquations();
    this.initSolutions();
  }
}
