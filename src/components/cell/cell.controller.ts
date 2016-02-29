///<reference path="../../ref.d.ts"/>

import MinefieldData from "../minefield/minefield.controller.ts";
import MinefieldService from "../../services/minefield.service";
import * as api from "../../common/api";

/**
 * @ngInject
 */
class MineController {

    public cellData:api.MinefieldCell;

    /**
     * @param swMinefieldService
     * @param $sce this service can be used to trust html from a string e.g. $sce.trustAsHtml("&nbsp;")
     */
    constructor(private swMinefieldService:MinefieldService, private $sce:ng.ISCEService) {
    }

    /**
     * This class returns an ng-class object (https://docs.angularjs.org/api/ng/directive/ngClass)
     */
    public getButtonClasses() {
        return {
            'sw-mine__button--hidden': false /* TODO: implement this condition */,
            'sw-mine__button--revealed': false /* TODO: implement this condition */,
            'sw-mine__button--has-mine': false /* TODO: implement this condition */,
            'sw-mine__button--flagged': false /* TODO: implement this condition */
        };
    }

}

export default MineController;
