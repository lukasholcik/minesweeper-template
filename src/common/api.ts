export class MinefieldCellStatus {
    static FLAGGED = "flagged";
    static HIDDEN = "hidden";
    static REVEALED = "revealed";
}

export interface IMinefieldCell {
    /**
     * coordinates
     */
    x: number;
    y: number;

    /**
     * if this field was already revealed or not
     */
    status: string;

    /**
     * if there's a mine present at this field
     */
    hasMine: boolean;

    /**
     * How many mines are on the adjacent fields
     */
    neighbours: number;
}

/**
 * One cell of the minefield
 */
export class MinefieldCell implements IMinefieldCell {

    /**
     * @inheritDoc
     */
    public neighbours = 0;
    /**
     * @inheritDoc
     */
    public hasMine = false;
    /**
     * @inheritDoc
     */
    public status = MinefieldCellStatus.HIDDEN;

    constructor(public x:number, public y:number) {
    }

}

/**
 * Model for minefield. Contains a matrix with cell information
 */
export class MinefieldData {

    /**
     * @param width Width of the minefield
     * @param height Height of the minefield
     * @param mines Number of mines scattered throughout the minefield
     * @param matrix Matrix with minefield cells. The properties of the minefield must correspond to the
     */
    constructor(public width: number,
                public height: number,
                public mines: number,
                public matrix:IMinefieldCell[][]) {
    }

    /**
     * Retrieve cell information on given coordinates
     *
     * @param x
     * @param y
     * @returns {IMinefieldCell}
     */
    public get(x: number, y: number):IMinefieldCell {
        return this.matrix[y][x];
    }

    /**
     * Retrieves all neighbours for given cell (horizontal, vertical and diagonal)
     * @param cell
     * @returns {Array}
     */
    public getNeighbours(cell:IMinefieldCell):IMinefieldCell[] {
        const result = [];
        for (let x = Math.max(0, cell.x - 1); x <= Math.min(this.width - 1, cell.x + 1); x++) {
            for (let y = Math.max(0, cell.y - 1); y <= Math.min(this.height - 1, cell.y + 1); y++) {
                if (x === cell.x && y === cell.y) {
                    continue;
                }
                result.push(this.get(x, y));
            }
        }
        return result;
    }

}

export enum EGameStatus {
    IN_PROGRESS = 0,
    SUCCESS = 1,
    FAIL = -1
}
