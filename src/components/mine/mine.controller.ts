///<reference path="../../ref.d.ts"/>

import MinefieldData from "../minefield/minefield.controller";
import MinefieldService from "../../services/minefield.service";
import * as api from "../../common/api";

/**
 * @ngInject
 */
class MineController {

    public cellData:api.MinefieldCell;

    constructor(private swMinefieldService:MinefieldService) {
    }

    // TODO: implement this method correctly
    public getButtonClasses() {
        return {
            'sw-mine__button--hidden': this.cellData.status === 'hidden',
            'sw-mine__button--revealed': false,
            'sw-mine__button--has-mine': false,
            'sw-mine__button--flagged': false
        };
    }

}

export default MineController;
