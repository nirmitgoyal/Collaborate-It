(function () {
  'use strict';

  angular
    .module('thinkster.authentication', [
      'thinkster.authentication.controllers',
      'thinkster.authentication.services'
    ]);

  angular
    .module('thinkster.authentication.controllers', ['ngCookies']);

  angular
    .module('thinkster.authentication.services', ['ngCookies']);
})();