///<reference path="../../ref.d.ts"/>

import * as api from "../../common/api";
import GameController from "./game.controller";

class Game implements ng.IDirective {

    public restrict = "E";
    public replace = true;
    public template = require<string>("./game.directive.html");
    public controller = GameController;
    public controllerAs = "vm";

}

export default Game;
