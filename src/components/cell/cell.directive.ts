///<reference path="../../ref.d.ts"/>

import "./cell.directive.less";
import CellController from "./cell.controller.ts";
import * as api from "../../common/api";

class Cell implements ng.IDirective {

    public restrict = "E";
    public replace = true;
    public template = require<string>("./cell.directive.html");
    public controller = CellController;
    public controllerAs = "vm";
    public scope = true;
    public require = ["swMine", "^swMinefield"];
    public bindToController = {
        /**
         * IMinefieldCell data for given cell
         */
        cellData: "=",
        /**
         * Whether this cell is disabled. The whole minefield will be disabled once the game is finished.
         * This flag should disable the .sw-cell__button inside the directive.
         */
        disabled: "@",
        /**
         * Click callback for the cell button
         */
        onClick: "&"
    };

}

export default Cell;
