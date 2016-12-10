/**
 * NavbarController
 * @namespace collaborate.layout.controllers
 */
(function() {
    'use strict';

    angular
    // .module('collaborate.layout.controllers',['collaborate.authentication.services'])
        .module('collaborate.layout.controllers')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', 'Authentication', '$cookieStore'];

    /**
     * @namespace NavbarController
     */
    function NavbarController($scope, Authentication, $cookieStore) {
        var vm = this;
        vm.logout = logout;
        vm.isAuthenticated = isAuthenticated;
        var username = $cookieStore.get('username');
        console.log(username);
        $scope.username = username;
        /**
         * @name logout
         * @desc Log the user out
         * @memberOf collaborate.layout.controllers.NavbarController
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
