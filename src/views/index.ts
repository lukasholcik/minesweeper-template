///<reference path="../ref.d.ts"/>

export default (module:ng.IModule)=> {
    /* @ngInject */
    module.config(($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider)=> {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('main', {
            url: '/',
            template: require<string>("./main/main.html")
        });
    });
}
