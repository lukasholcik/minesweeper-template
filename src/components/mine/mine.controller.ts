///<reference path="../../ref.d.ts"/>

import MinefieldData from "../minefield/minefield.controller";
import {IMinefieldCell} from "../../common/api";
import {MinefieldCell} from "../../common/api";
import MinefieldService from "../../services/minefield.service";

/**
 * @ngInject
 */
class MineController {

    public cellData:MinefieldCell;

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
