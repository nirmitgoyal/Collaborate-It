(function() {
    'use strict';

    angular
        .module('thinkster.authentication.controllers')
        .controller('SyncController', SyncController);

    SyncController.$inject = ['$location', '$scope', 'Authentication','md5'];


    function SyncController($location, $scope, Authentication,md5) {
        var vm = this;

        vm.register = register;
        $scope.url =  md5.createHash(vm.email).toString(5);


        activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf thinkster.authentication.controllers.RegisterController
         */
        function activate() {
            // If the user is authenticated, they should not be here.
            if (Authentication.isAuthenticated()) {
                $location.url('/' + $scope.url);
            }
        }

        /**
         * @name register
         * @desc Register a new user
         * @memberOf thinkster.authentication.controllers.RegisterController
         */
        function register() {
            Authentication.register(vm.email, vm.password, vm.username);
        }

        function getAuthenticatedAccount() {
            if (!$cookies.authenticatedAccount) {
                return;
            }

            return JSON.parse($cookies.authenticatedAccount);
        }

    }
})();
