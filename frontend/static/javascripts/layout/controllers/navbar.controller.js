/**
 * NavbarController
 * @namespace thinkster.layout.controllers
 */
(function() {
    'use strict';

    angular
        // .module('thinkster.layout.controllers',['thinkster.authentication.services'])
        .module('thinkster.layout.controllers')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', 'Authentication'];

    /**
     * @namespace NavbarController
     */
    function NavbarController($scope, Authentication) {
        var vm = this;

        // vm = {
        //         logout : logout,
        //         isAuthenticated : isAuthenticated
        //     };
            vm.logout = logout;
            vm.isAuthenticated = isAuthenticated;

        /**
         * @name logout
         * @desc Log the user out
         * @memberOf thinkster.layout.controllers.NavbarController
         */
        function logout() {
            // alert("logout");
            Authentication.logout();
        }

        function isAuthenticated() {
            // alert(Authentication.isAuthenticated());
            // console.log(Authentication.isAuthenticated());
            return Authentication.isAuthenticated();
            // return "1";
        }
    }
})();
