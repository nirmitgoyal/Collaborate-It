(function() {
    'use strict';
    angular.module('collaborate.authentication.controllers').controller('SyncController', SyncController);
    SyncController.$inject = ['$location', '$scope', 'Authentication', 'md5', '$cookies', '$cookieStore', '$http'];

    function SyncController($location, $scope, Authentication, md5, $cookies, $cookieStore, $http) {
        var vm = this;
        vm.check_url = check_url;
        var email = $cookieStore.get('email');

        activate();

        console.log(email);
        var BASE_URL = "http://localhost:8001";

        // Runs when editor loads
        $scope.aceLoaded = function(_editor) {
            console.log('Ace editor loaded successfully');
            $scope.aceSession = _editor.getSession();
            _editor.$blockScrolling = Infinity;
            // _session.setUndoManager(new ace.UndoManager());
            // Editor Events
            // _session.on("change", function(){
            //   console.log('[EditorCtrl] Session changed:', _session);
            // });
        };
        //Runs every time the value of the editor is changed
        $scope.aceChanged = function(_editor) {
            console.log(_editor);
            console.log('Ace editor changed');
            // Get Current Value
            $scope.currentValue = $scope.aceSession.getDocument().getValue();
            var value = $scope.currentValue
                // console.log(value);
            return $http.post(BASE_URL + '/api/v1/auth/code/', {
                code: value,
                email: email,
                url: $scope.url
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            });
            // Set value
            // _editor.getSession().setValue('This text is now in the editor');
            // $scope.aceSession.setValue("message");
        };
        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf collaborate.authentication.controllers.RegisterController
         */
        function activate() {
            // If the user is authenticated, they should not be here.
            if (Authentication.isAuthenticated()) {
                $scope.url = md5.createHash(email);

                $location.url('/' + $scope.url);
                // $location.url('/' );
            } else {
                $location.url('/login');
            }

        }

        function check_url() {
            var urlHash = $location.url();
            urlHash = urlHash.slice(1);
            console.log(urlHash);
            $http.get(BASE_URL + '/api/v1/auth/check_url/?url=' + urlHash).then(function(response) {
                if (response.data.status == 'success') {
                    $scope.aceSession.setValue(response.data.code);
                    init();
                } else {
                    // $scope.aceSession.setValue("// Your code goes here");
                }
            }, function(error) {
                console.error(error);
                // $scope.aceSession.setValue("Your code goes here");
            });
        }

        function init() {
            var socket = io.connect('localhost:4000');
            socket.on('connect', function() {
                console.log("connect");
            });
            // var entry_el = $('#comment');
            socket.on('message', function(message) {
                // $scope.aceSession.setValue(message);
                console.log("hello");
            });
            // entry_el.keypress(function(event) {
            //     //When enter is pressed send input value to node server
            //     if (event.keyCode != 13) return;
            //     var msg = entry_el.attr('value');
            //     if (msg) {
            //         socket.emit('send_message', msg, function(data) {
            //             console.log(data);
            //         });
            //         //Clear input value   
            //         entry_el.attr('value', '');
            //     }
            // });
        }
        check_url();
    }
})();
