import MinefieldService from "../../services/minefield.service.ts";
import {MinefieldData} from "../../common/api";

export enum EGameStatus {
    IN_PROGRESS = 0,
    SUCCESS = 1,
    FAIL = -1
}

/**
 * @ngInject
 */
class GameController {

    public minefield:MinefieldData;
    public gameStatus:EGameStatus = EGameStatus.IN_PROGRESS;

    /**
     * @param swMinefieldService
     */
    constructor(swMinefieldService:MinefieldService) {
        const width = 20;
        const height = 20;
        const mines = 50;

        this.minefield = swMinefieldService.newMinefield(width, height, mines);
    }

}

export default GameController;
