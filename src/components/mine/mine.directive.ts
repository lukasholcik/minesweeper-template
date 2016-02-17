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
        mine: "=",
        disabled: "&"
    };

}

export default Mine;
