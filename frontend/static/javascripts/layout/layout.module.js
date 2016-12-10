(function () {
  'use strict';

  angular
    .module('collaborate.layout', [
      'collaborate.layout.controllers'
    ]);

  angular
    .module('collaborate.layout.controllers', ['ngCookies']);
})();