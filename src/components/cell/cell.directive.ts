///<reference path="../../ref.d.ts"/>

import "./cell.directive.less";
import MineController from "./cell.controller.ts";
import MinefieldController from "../minefield/minefield.controller.ts";
import * as api from "../../common/api";

class Mine implements ng.IDirective {

    public restrict = "E";
    public replace = true;
    public template = require("./cell.directive.html");
    public controller = MineController;
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

export default Mine;
