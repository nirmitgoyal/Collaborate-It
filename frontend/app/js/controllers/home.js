import 'firebase';
import Firepad from 'firepad';


function homeCtrl($scope, $location, $http, $cookies) {
    console.log("start controller");
    'ngInject';
    // ViewModel
    const vm = this;

    vm.title = 'AngularJS, Gulp, and Browserify! Written with keyboards and love!';
    vm.number = 1234;
    vm.getExampleRef = getExampleRef;
    vm.init = init;
    vm.run = run;
    $scope.run = run;
    var BASE_URL = "http://localhost:8000/";

    init();
    $scope.url = $location.url();



    function run() {

        $scope.source = "print 'Hello World'"; //temp
        var CLIENT_SECRET = '30795ca791b2d0c65bd5e83751dc938057f994a7'; //changed
        
        var url = 'https://api.hackerearth.com/v3/code/run/';
        var csrfmiddlewaretoken = $cookies.get('csrftoken');
        console.log(csrfmiddlewaretoken);
        var data = {
            'csrfmiddlewaretoken': csrfmiddlewaretoken,
            'client_secret': CLIENT_SECRET,
            'async': 1,
            'source': $scope.source,
            'lang': "PYTHON" //$scope.lang
        };
        var config = {
            headers: {
                // 'Content-Type': 'application/javascript; charset=UTF-8',
                // 'Access-Control-Allow-Origin': '*'
                // 'Access-Control-Allow-Methods': 'POST',
                // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
            }
        };

        // $http.post(url, data, config).then(success, failure);
        $http.post(BASE_URL + "run/", data).then(success, failure);


        function success(response) {
            console.log(response);
            $scope.status = response.status;
            $scope.data = response.data;
        }

        function failure(response) {
            console.log(response);
            $scope.data = response.data || 'Request failed';
            $scope.status = response.status;
        }


        // $http({
        //     method: 'POST',
        //     url: 'https://api.hackerearth.com/v3/code/run/',
        //     data: data
        // }).then(function successCallback(response) {
        //     // this callback will be called asynchronously
        //     // when the response is available
        //     console.log(response);
        //     $scope.status = response.status;
        //     $scope.data = response.data;
        // }, function errorCallback(response) {
        //     // called asynchronously if an error occurs
        //     // or server returns response with an error status.
        //     console.log(response);
        //     $scope.data = response.data || 'Request failed';
        //     $scope.status = response.status;
        // });
    } // end run()

    function init() {

        //// Initialize Firebase.
        console.log("start init");
        var config = {
            apiKey: 'AIzaSyD5TVl2jSrzh54OYxBThMZPYQg7U8WTxKs',
            authDomain: 'collaborate-it.firebaseapp.com',
            databaseURL: 'https://collaborate-it.firebaseio.com',
        };
        firebase.initializeApp(config);
        //// Get Firebase Database reference.
        var firepadRef = getExampleRef();
        console.log("before ace");

        //create ace        
        var editor = ace.edit('firepad-container');
        // // editor.setTheme('ace/theme/textmate');
        var session = editor.getSession();
        // session.setUseWrapMode(true);
        session.setUseWorker(false);
        session.setMode('ace/mode/javascript');
        editor.setValue("");

        //// Create Firepad.
        var firepad = Firepad.fromACE(firepadRef, editor, {
            defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}'
        });
        // i don't think there is a need for a directive for such a small thing:;;;;;
        document.getElementById("firepad-container").parentElement.style.height = "400px";
        console.log('finished');
    }

    // Helper to get hash from end of URL or generate a random one.
    function getExampleRef() {
        var ref = firebase.database().ref();
        var hash = window.location.hash.replace(/#/g, '');
        if (hash) {
            ref = ref.child(hash);
        } else {
            ref = ref.push(); // generate unique location.
            $location.url('#' + ref.key);
            // window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
        }
        console.log(window.location);
        if (typeof console !== 'undefined') {
            console.log('Firebase data: ', ref.toString());
        }
        return ref;
    }
}

export default {
    name: 'homeCtrl',
    fn: homeCtrl
};
//// Create CodeMirror (with line numbers and the JavaScript mode).
// var attrValue = "{onLoad : codemirrorLoaded,lineNumbers: true,mode: 'javascript'}";
// var attrValue = "{\
//         onLoad: aceLoaded,\
//         onChange: aceChanged,\
//         mode: 'javascript', \
//         advanced: {\
//           enableSnippets: true,\
//           enableBasicAutocompletion: true,\
//           enableLiveAutocompletion: true,\
//           fontSize: '18px',\
//         }\
//       }";
// var el = angular.element(document.getElementById('firepad-container'));
// el.attr('ui-ace', attrValue);

// el.attr('ui-codemirror', attrValue);
// var _editor;
// $scope.codemirrorLoaded = function(_editor) {
//     _editor = _editor;
// };
// var editor = CodeMirror(document.getElementById('firepad-container'), {
//     lineNumbers: true,
//     mode: 'javascript'
// });
//// Create ACE
// console.log("before ace");

// Runs when editor loads
// make editor global
// var editor;
// $scope.aceLoaded = function(editor) {
//     console.log('Ace editor loaded successfully');
//     editor = editor;
//     // $scope.aceDocumentValue =
//     // "#include<bits/stdc++.h>;\nusing namespace std;\n\nint main()\n{\n   for (int i = 0; i< count; i++)\n   {\n      /* code */\n   }\n\n   return 0;\n}";
//     $scope.aceSession = editor.getSession();
//     // $scope.Editor = _editor;
//     editor.$blockScrolling = Infinity;
// };


// var imported = document.createElement('script');
// // imported.src = '/path/to/imported/script';
// imported.src = './../../../node_modules/codemirror/lib/codemirror.js';
// document.head.appendChild(imported);
