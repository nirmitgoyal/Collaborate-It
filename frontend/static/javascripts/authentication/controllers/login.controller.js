/**
 * LoginController
 * @namespace collaborate.authentication.controllers
 */
(function() {
    'use strict';

    angular
        .module('collaborate.authentication.controllers')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$scope', 'Authentication','$cookies'];

    /**
     * @namespace LoginController
     */
    function LoginController($location, $scope, Authentication,$cookies) {
        var vm = this;

        vm.login = login;

        activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf collaborate.authentication.controllers.LoginController
         */
        function activate() {
            // If the user is authenticated, they should not be here.
            if (Authentication.isAuthenticated()) {
                // alert("logged in");
                $location.url('/');
            }
            else{
                // alert("not logged in");
            }

        }

        /**
         * @name login
         * @desc Log the user in
         * @memberOf collaborate.authentication.controllers.LoginController
         */
        function login() {
            Authentication.login(vm.email, vm.password);
        }
    }
})();
