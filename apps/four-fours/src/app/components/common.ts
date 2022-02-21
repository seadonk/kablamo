import {evaluate} from "mathjs";
import {getRange} from "@kablamo/utils";

export const Operators = ['+', '-', '*', '/', '(', ')', '!', '^'] as const;
export type Operator = typeof Operators[number];
export type Equation = (number | Operator)[];
export type Solutions = {
  [index: number]: {
    [index: number]: Equation
  }
}
const equationStorageKey = 'answers';
export const getHighestStoredAnswer = (number: number, solutions: Solutions) => {
  if (!solutions || !solutions[number] || !Object.keys(solutions[number]).length) return -1;
  return Math.max(...Object.keys(solutions[number]).map(t => +t));
}
export const clearEquations = () => localStorage.removeItem(equationStorageKey);
export const loadSolutions = (): Solutions => JSON.parse(localStorage.getItem(equationStorageKey));
export const addProblem = (solutions: Solutions, number: number, answer: number, equation?: Equation) => {
  equation = equation ?? getDefaultEquation(number);
  solutions[number] = solutions[number] ?? {};
  solutions[number][answer] = equation;
}
export const storeSolution = (solutions: Solutions, number: number, answer: number, equation: Equation) => {
  addProblem(solutions, number, answer, equation);
  localStorage.setItem(equationStorageKey, JSON.stringify(solutions));
}


/**
 * Alternative to using eval()
 * @param guess
 * @see https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/eval#never_use_eval!
 */
export const evaluateGuess = (guess: string): number | undefined =>
  Function('"use strict";return (' + guess + ')')();
/**
 * Using mathjs (alternative to using evaluateGuess above)
 * @see https://mathjs.org/docs/expressions/parsing.html#evaluate
 * @param guess
 */
export const mathEvaluateGuess = (guess: string): number | undefined => evaluate(guess);
export const getDefaultEquation = (number: number): Equation => getRange(number - 1).map(() => number);
