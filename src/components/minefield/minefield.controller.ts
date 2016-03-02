import * as api from "../../common/api";
import MinefieldService from "../../services/minefield.service";
import {MinefieldData} from "../../common/api";
import EGameStatus from "../game/game.controller";

/**
 * @ngInject
 */
class MinefieldController {

    public minefield:api.MinefieldData;
    public gameStatus:EGameStatus;

    /**
     * @param swMinefieldService
     */
    constructor(private swMinefieldService:MinefieldService) {
    }

    /**
     * Click callback for given cell
     */
    public onClick = ($event:JQueryEventObject, cellData:api.IMinefieldCell):void => {

    };

    public isDisabled():boolean {
        return false;
    }

}

export default MinefieldController;
