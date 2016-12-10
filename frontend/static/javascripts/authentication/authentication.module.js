(function () {
  'use strict';

  angular
    .module('collaborate.authentication', [
      'collaborate.authentication.controllers',
      'collaborate.authentication.services'
    ]);

  angular
    .module('collaborate.authentication.controllers', ['ngCookies']);

  angular
    .module('collaborate.authentication.services', ['ngCookies']);
})();