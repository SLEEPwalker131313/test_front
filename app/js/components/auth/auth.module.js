;(function (angular) {
  'use strict';

  angular.module('core.auth', [])
      .config(config);

  function config($stateProvider) {
    $stateProvider
        .state({
          name: 'app.non_auth.login',
          url:'/login',
          views: {
            'content@app.non_auth': {
              template: `<gh-login></gh-login>`
            }
          },
          bodyClass: 'login'
        })
  }
})(angular);