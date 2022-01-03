import {
  generateBoard,
  getFilledCells,
  getRegionSets,
  hash,
  isSetUnique,
  isSolveable,
  printBoard,
  solveAll,
  SudokuBoard,
  transpose
} from "./sudoku";
import {getRange, stopWatch} from "../../../../utils/src/lib/utils";

(function () {
  stopWatch(() => {
    const clues = 35;
    const boards: Set<string> = new Set<string>();
    const numBoards = 100;
    console.log(`generating ${numBoards} boards with ${clues} clues...`);
    getRange(numBoards - 1).forEach(() => {
        boards.add(hash(generateBoard(clues)));
      }
    );
    console.log('unique boards: ' + boards.size);

    // not sure why i can't do this yet, should be the same solve time as solve()
    // solveAll(Examples.emptyBoard, 1).forEach(t => {
    //   logBoard(t);
    // })
  });
})();

export const analyzeBoard = (board: SudokuBoard, showAllSolutions = false) => {
  const filledCells = getFilledCells(board);
  const completeRegions = getRegionSets(board).filter(t => !t.some(c => !c) && isSetUnique(t)).length;
  const completeColumns = transpose(board).filter(t => !t.some(c => !c) && isSetUnique(t)).length;
  const completeRows = board.filter(t => !t.some(c => !c) && isSetUnique(t)).length;
  const regions = getRegionSets(board).length;
  const rows = board.length;
  const columns = transpose(board).length;
  const cells = board.flatMap(t => t).length;
  console.log(`${filledCells}/${cells} - Filled Cells`);
  console.log(`${completeRegions}/${regions} - Complete Regions`);
  console.log(`${completeColumns}/${columns} - Complete Columns`);
  console.log(`${completeRows}/${rows} - Complete Rows`);

  console.log(`isSolveable: ${isSolveable(board)}`);
  if (showAllSolutions) {
    const solutions = solveAll(board);
    console.log('Solutions: ', solutions.length);
    solutions.forEach((t, i) => {
      console.log();
      console.log(`Solution ${i + 1}`);
      logBoard(t)
    });
  }
}

export const logBoard = (board: SudokuBoard) => console.log(printBoard(board));
export const logStatus = (board: SudokuBoard) => {
  logBoard(board);

  // console.log('isComplete', isComplete(board));
  // console.log('isValid', isValid(board));
  // console.log('isSolved', isSolved(board));
  analyzeBoard(board, true);
  console.log();
}
