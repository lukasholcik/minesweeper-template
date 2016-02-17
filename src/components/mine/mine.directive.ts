///<reference path="../../ref.d.ts"/>

import "./mine.directive.less";
import MineController from "./mine.controller";

class Mine implements ng.IDirective {

    public restrict = "E";
    public replace = true;
    public template = require("./mine.directive.html");
    public controller = MineController;
    public controllerAs = "vm";
    public scope = true;
    public bindToController = {
        /**
         * IMinefieldCell data for given cell
         */
        cellData: "=",
        /**
         * Whether this cell is disabled. The whole minefield will be disabled once the game is finished.
         * This flag should disable the .sw-mine__button inside the directive.
         */
        disabled: "@"
    };

}

export default Mine;
