(function() {
    'use strict';

    angular
        .module('collaborate', [
            'collaborate.config',
            'collaborate.routes',
            'collaborate.authentication',
            'collaborate.layout',
            'ui.ace',
            'vcRecaptcha',
            'angular-md5'
        ]);

    angular
        .module('collaborate.config', []);

    angular
        .module('collaborate.routes', ['ngRoute']);

    angular
        .module('collaborate')
        .run(run);

    run.$inject = ['$http'];

    /**
     * @name run
     * @desc Update xsrf $http headers to align with Django's defaults
     */
    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }
})();
