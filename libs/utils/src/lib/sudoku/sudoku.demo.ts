import {logStatus, solveAll, stopWatch} from "./sudoku";
import {Examples} from "./sudoku.examples";

(function () {
  // deep copy the preset so we don't modify it. modifying it might break tests.
  // we should probably add logic to copy these examples for us
  // const board: SudokuBoard = twoSolutions;
  const board = Examples.invalidRegions;
  logStatus(board);
  stopWatch(() => {
    solveAll(board).forEach(t => logStatus(t));
    // logStatus(emptyBoard);
    // logStatus(board);
    //   const solved = solve(board);
    //   logStatus(board);
    //   if (solved) {
    //     console.log('Solved!');
    //   } else {
    //     console.log('No Solutions!');
    //   }
  });
})();
