(function() {
    'use strict';
    angular.module('collaborate.authentication.controllers').controller('SyncController', SyncController);
    SyncController.$inject = ['$location', '$scope', 'Authentication', 'md5', '$cookies', '$cookieStore', '$http', '$interval'];

    function SyncController($location, $scope, Authentication, md5, $cookies, $cookieStore, $http, $interval) {
        var vm = this;
        vm.check_url = check_url;
        var email = $cookieStore.get('email');
        vm.init = init;
        vm.keystroke = keystroke;
        var BASE_URL = "http://localhost:8001";

        activate();
        check_url();
        // $interval(check_url, 3000);

        // Runs when editor loads
        $scope.aceLoaded = function(_editor) {
            console.log('Ace editor loaded successfully');
            $scope.aceDocumentValue =
                "#include<bits/stdc++.h>;\nusing namespace std;\n\nint main()\n{\n   for (int i = 0; i< count; i++)\n   {\n      /* code */\n   }\n\n   return 0;\n}";
            $scope.aceSession = _editor.getSession();
            $scope.Editor = _editor;
            _editor.$blockScrolling = Infinity;
        };

        //Runs every time the value of the editor is changed
        // $scope.aceChanged = function(_editor) {
        //Runs on every keystroke
        function keystroke() {
            console.log('Ace editor changed');
            $scope.pos = $scope.Editor.getCursorPosition();
            $scope.pos.column += 1;
            console.log($scope.pos);
            // Get Current Value
            var value = $scope.aceSession.getDocument().getValue();

            $http.post(BASE_URL + '/api/v1/auth/code/', {
                code: value,
                email: email,
                url: $scope.url
            }, {
                headers: {
                    'Content-Type': 'application/javascript; charset=UTF-8'
                }
            }).then(success, failure);

            function success(data, status, headers, config) {
                console.log("Code saved");
            }

            function failure(data, status, headers, config) {
                console.log("Code save failed");
            }

        };

        function check_url() {
            var urlHash = $location.url();
            urlHash = urlHash.slice(1);
            $http.get(BASE_URL + '/api/v1/auth/check_url/?url=' + urlHash).then(function(response) {
                if (response.data.status == 'success') {
                    // $scope.aceSession.setValue(response.data.code);
                    $scope.aceDocumentValue = response.data.code;
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
                console.log("keystroke");
                $scope.$apply(function() {
                    $scope.aceDocumentValue = message;
                    // console.log($scope.aceDocumentValue);
                });
                console.log($scope.pos);

                $scope.Editor.moveCursorToPosition($scope.pos);
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

    }
})();
