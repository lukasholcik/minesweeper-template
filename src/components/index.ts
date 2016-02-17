///<reference path="../ref.d.ts"/>

import toFactory from "../common/to-factory";
import Minefield from "./minefield/minefield.directive";
import Mine from "./mine/mine.directive";

export default (module:ng.IModule) => {
    module.directive("swMinefield", toFactory(Minefield));
    module.directive("swMine", toFactory(Mine));
}
