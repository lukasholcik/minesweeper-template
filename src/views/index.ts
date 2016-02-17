///<reference path="../ref.d.ts"/>

import GameController from "./game/game.controller";

export default (module:ng.IModule)=> {
    module.controller("GameController", GameController);

    /* @ngInject */
    module.config(($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider)=> {
        $urlRouterProvider.otherwise('/game');

        $stateProvider.state('game', {
            url: '/game',
            template: require("./game/game.html"),
            controller: "GameController",
            controllerAs: "vm",
        });

    });
}
