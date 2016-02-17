import MinefieldService from "../../services/minefield.service";
import {MinefieldData} from "../../common/api";

class GameController {

    public minefield:MinefieldData;

    /**
     * @ngInject
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
