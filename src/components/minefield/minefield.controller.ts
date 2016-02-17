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

    /**
     * @param swMinefieldService
     * @param $sce this service can be used to trust html from a string e.g. $sce.trustAsHtml("&nbsp;")
     */
    constructor(private swMinefieldService:MinefieldService, private $sce:ng.ISCEService) {
    }

}

export default MinefieldController;
