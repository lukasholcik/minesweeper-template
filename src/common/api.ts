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

export class MinefieldCell implements IMinefieldCell {

    public neighbours = 0;
    public hasMine = false;
    public status = MinefieldCellStatus.HIDDEN;

    constructor(public x:number, public y:number) {
    }

}

export class MinefieldData {

    constructor(public width: number,
                public height: number,
                public mines: number,
                private matrix:IMinefieldCell[][]) {
    }

    public get(x: number, y: number):IMinefieldCell {
        return this.matrix[y][x];
    }

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
