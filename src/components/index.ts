///<reference path="../ref.d.ts"/>

import toFactory from "../common/to-factory";
import Minefield from "./minefield/minefield.directive.ts";
import Mine from "./cell/cell.directive.ts";
import Game from "./game/game.directive";

export default (module:ng.IModule) => {
    module.directive("swMinefield", toFactory(Minefield));
    module.directive("swCell", toFactory(Mine));
    module.directive("swGame", toFactory(Game));
}
