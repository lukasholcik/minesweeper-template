import MinefieldService from "../../services/minefield.service";
import * as api from "../../common/api";

export enum EGameStatus {
    NONE = 0,
    SUCCESS = 1,
    FAIL = -1
}

/**
 * @ngInject
 */
class MinefieldController {

    constructor(private swMinefieldService:MinefieldService) {
    }

}

export default MinefieldController;
