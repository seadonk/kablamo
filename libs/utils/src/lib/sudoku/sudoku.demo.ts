import {generateBoard, getRange, hash, stopWatch} from "./sudoku";

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
