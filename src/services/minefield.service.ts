import {MinefieldData} from "../common/api";
import {IMinefieldCell} from "../common/api";
import {MinefieldCell} from "../common/api";
import {MinefieldCellStatus} from "../common/api";

class MinefieldService {

    /**
     * Create minefield of given dimensions and populate it with mines
     *
     * @param width
     * @param height
     * @param mines
     * @returns {MinefieldData}
     */
    public newMinefield(width:number, height:number, mines:number):MinefieldData {
        const matrix:IMinefieldCell[][] = [];
        // initialize minefield objects
        for (let rowIdx = 0; rowIdx < height; rowIdx++) {
            const row = [];
            matrix.push(row);

            for (let columnIdx = 0; columnIdx < width; columnIdx++) {
                const mine:IMinefieldCell = new MinefieldCell(columnIdx, rowIdx);
                row.push(mine);
            }
        }

        const minefield = new MinefieldData(width, height, mines, matrix);

        this.randomizeMines(minefield, mines);

        return minefield;
    }

    public uncover(mine:IMinefieldCell, minefield:MinefieldData):number {
        if (mine.status === MinefieldCellStatus.REVEALED) {
            return 0;
        }
        let uncovered = 1;
        mine.status = MinefieldCellStatus.REVEALED;
        if (!mine.hasMine && mine.neighbours === 0) {
            for (let neighbour of minefield.getNeighbours(mine)) {
                if (neighbour.status === MinefieldCellStatus.HIDDEN) {
                    uncovered += this.uncover(neighbour, minefield);
                }
            }
        }
        return uncovered;
    }

    public getHiddenCells(minefield:MinefieldData):number {
        let result = 0;
        for (let x = 0; x < minefield.width; x++) {
            for (let y = 0; y < minefield.height; y++) {
                if (minefield.get(x, y).status !== MinefieldCellStatus.REVEALED) {
                    result++;
                }
            }
        }
        return result;
    }

    private randomizeMines(minefield:MinefieldData, mines:number):void {
        if (mines >= minefield.width * minefield.height) {
            throw new Error("Number of mines must be less than number of cells.");
        }

        // initialize mines
        for (let m = 0; m < mines; m++) {
            let x;
            let y;
            do {
                x = Math.floor(Math.random() * minefield.width);
                y = Math.floor(Math.random() * minefield.height);
            } while (minefield.get(x, y).hasMine);

            const cell = minefield.get(x, y);
            cell.hasMine = true;

            //console.log("Mine set at:", x, y);
            // initialize neighbours
            for (let neighbour of minefield.getNeighbours(cell)) {
                neighbour.neighbours++;
            }
        }
    }

}

export default MinefieldService;
