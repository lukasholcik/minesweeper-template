import MinefieldService from "../../services/minefield.service";
import * as api from "../../common/api";

export enum EGameStatus {
    IN_PROGRESS = 0,
    SUCCESS = 1,
    FAIL = -1
}

/**
 * @ngInject
 */
class MinefieldController {

    public gameStatus:EGameStatus = EGameStatus.IN_PROGRESS;

    /**
     * @param swMinefieldService
     */
    constructor(private swMinefieldService:MinefieldService) {
    }

    /**
     * Click callback for given cell
     */
    public onClick = (cellData:api.IMinefieldCell)=> {

    };

    public isDisabled():boolean {
        return false;
    }

}

export default MinefieldController;
