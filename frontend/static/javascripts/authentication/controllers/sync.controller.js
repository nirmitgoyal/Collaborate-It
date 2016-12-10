(function() {
    'use strict';

    angular
        .module('thinkster.authentication.controllers')
        .controller('SyncController', SyncController);

    SyncController.$inject = ['$location', '$scope', 'Authentication', 'md5', '$cookies', '$cookieStore', '$http'];


    function SyncController($location, $scope, Authentication, md5, $cookies, $cookieStore, $http) {
        var vm = this;
        // $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        vm.register = register;
        vm.login = login;
        var email = $cookieStore.get('email');
        console.log(email);
        $scope.url = md5.createHash(email);
        var BASE_URL = "http://localhost:8001";


        activate();

        // Runs when editor loads
        $scope.aceLoaded = function(_editor) {
            console.log('Ace editor loaded successfully');
            $scope.aceSession = _editor.getSession();
            // _session.setUndoManager(new ace.UndoManager());
            // Editor Events
            // _session.on("change", function(){
            //   console.log('[EditorCtrl] Session changed:', _session);
            // });
        };

        //Runs every time the value of the editor is changed
        $scope.aceChanged = function(_editor) {
            console.log('Ace editor changed');
            // Get Current Value
            $scope.currentValue = $scope.aceSession.getDocument().getValue();
            var value = $scope.currentValue
            console.log(value);
            $http.post(BASE_URL + '/api/v1/auth/code/', {
                code: value,
                email: email,
                url: $scope.url
            });

            // Set value
            //_editor.getSession().setValue('This text is now in the editor');
        };


        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf thinkster.authentication.controllers.RegisterController
         */

        function activate() {
            // If the user is authenticated, they should not be here.
            if (Authentication.isAuthenticated()) {
                // $location.url('/' + $scope.url);
                // $location.url('/' );

            }
        }

        /**
         * @name register
         * @desc Register a new user
         * @memberOf thinkster.authentication.controllers.RegisterController
         */
        function login() {
            console.log(Authentication.login(vm.email, vm.password, function(data) {
                console.log(data)
            }));

        }

        function register() {
            // Authentication.register(vm.email, vm.password, vm.username);
        }
    }
})();
