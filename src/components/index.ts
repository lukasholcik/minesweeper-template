///<reference path="../ref.d.ts"/>

import toFactory from "../common/to-factory";
import Minefield from "./minefield/minefield.directive.ts";
import Mine from "./cell/cell.directive.ts";

export default (module:ng.IModule) => {
    module.directive("swMinefield", toFactory(Minefield));
    module.directive("swCell", toFactory(Mine));
}
