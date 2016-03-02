import MinefieldService from "../../services/minefield.service.ts";
import * as api from "../../common/api";

/**
 * @ngInject
 */
class GameController {

    public minefield:api.MinefieldData;
    public gameStatus:api.EGameStatus = api.EGameStatus.IN_PROGRESS;

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
