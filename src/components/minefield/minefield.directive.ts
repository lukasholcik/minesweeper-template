///<reference path="../../ref.d.ts"/>

import "./minefield.directive.less";
import MinefieldController from "./minefield.controller";

class Minefield {
    public template = require("./minefield.directive.html");
    public replace = true;
    public restrict = "E";
    public controller = MinefieldController;
    public controllerAs = "vm";
}

export default Minefield;
