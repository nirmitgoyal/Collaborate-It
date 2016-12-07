(function() {
    'use strict';

    angular
        .module('thinkster.routes')
        .config(config);

    config.$inject = ['$routeProvider'];

    /**
     * @name config
     * @desc Define valid application routes
     */
    function config($routeProvider) {
        $routeProvider
            .when("/", {
                // templateUrl: "/templates/login/code.html",
                templateUrl: "code.html",
                controller: "codeCtrl"
            })
            .when("/code", {
                templateUrl: "code.html",
                controller: "codeCtrl"

            })
            .when("/login", {
                templateUrl: "login.html",
                controller: "loginCtrl"
            })
            .when('/register', {
                controller: 'RegisterController',
                controllerAs: 'vm',
                templateUrl: 'register.html'
                    // templateUrl: '/static/templates/authentication/register.html'
            }).otherwise('/');
    }
})();
