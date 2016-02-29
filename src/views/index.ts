///<reference path="../ref.d.ts"/>

import GameController from "./game/game.controller";

export default (module:ng.IModule)=> {
    module.controller("GameController", GameController);

    /* @ngInject */
    module.config(($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider)=> {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('game', {
            url: '/',
            template: require("./game/game.html"),
            controller: "GameController",
            controllerAs: "vm",
        });

    });
}
