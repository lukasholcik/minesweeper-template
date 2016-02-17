///<reference path="../ref.d.ts"/>

import MinefieldService from "./minefield.service";

export default (module:ng.IModule)=> {
    module.service("swMinefieldService", MinefieldService);
}