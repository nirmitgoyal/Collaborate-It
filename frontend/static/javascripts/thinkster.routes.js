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
            .when('/', {
                controller: 'SyncController',
                controllerAs: 'vm',
                templateUrl: '/static/templates/authentication/code.html'
            })
            .when('/code', {
                controller: 'SyncController',
                controllerAs: 'vm',
                templateUrl: '/static/templates/authentication/code.html'
            })
            .when('/register', {
                controller: 'RegisterController',
                controllerAs: 'vm',
                templateUrl: '/static/templates/authentication/register.html'
            })
            .when('/login', {
                controller: 'LoginController',
                controllerAs: 'vm',
                templateUrl: '/static/templates/authentication/login.html'
            })
            .otherwise('/');
    }
})();
