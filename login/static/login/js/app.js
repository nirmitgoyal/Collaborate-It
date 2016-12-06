var myapp = angular
    .module('myapp', ['ui.ace', 'ngRoute','vcRecaptcha']);
// .config(config);

// function config($routeProvider) {
myapp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            // templateUrl: "/templates/login/code.html",
            templateUrl: "/templates/login/code.html",            
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
        .when("/register", {
            templateUrl: "register.html",
            controller: "registerCtrl"
        })
        .when("/about", {
            templateUrl: "about.html",
            controller: "aboutCtrl"
        })
        .otherwise({
            templateUrl: "not_found_404.html"
        });
});

myapp.controller("codeCtrl", function($scope) {
    // $scope.msg = "";
});

myapp.controller("loginCtrl", function($scope) {
    // $scope.msg = "";
});

myapp.controller("aboutCtrl", function($scope) {
    // $scope.msg = "";
});
