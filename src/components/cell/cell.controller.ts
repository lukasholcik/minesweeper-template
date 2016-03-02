///<reference path="../../ref.d.ts"/>

import MinefieldData from "../minefield/minefield.controller.ts";
import MinefieldService from "../../services/minefield.service";
import * as api from "../../common/api";

/**
 * @ngInject
 */
class MineController {

    public cellData:api.MinefieldCell;
    public onClick:(args:{$event:JQueryEventObject, cellData:api.IMinefieldCell})=>void;


    /**
     * @param swMinefieldService
     * @param $sce this service can be used to trust html from a string e.g. $sce.trustAsHtml("&nbsp;")
     */
    constructor(private swMinefieldService:MinefieldService) {
    }

    /**
     * This class returns an ng-class object (https://docs.angularjs.org/api/ng/directive/ngClass)
     */
    public getButtonClasses() {
        return {
            'sw-cell__button--hidden': false /* TODO: implement this condition */,
            'sw-cell__button--revealed': false /* TODO: implement this condition */,
            'sw-cell__button--has-mine': false /* TODO: implement this condition */,
            'sw-cell__button--flagged': false /* TODO: implement this condition */
        };
    }

    public getButtonText() {
        return "?";
    }

}

export default MineController;
