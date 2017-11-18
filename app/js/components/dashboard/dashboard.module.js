;(function (angular) {
  'use strict';

  angular.module('core.dashboard', [])
      .config(config);

  function config($stateProvider) {
    $stateProvider
        .state({
          name: 'app.auth.overview',
          url:'/overview',
          views: {
            'content@app.auth': {
              template: `<gh-overview></gh-overview>`
            }
          },
          bodyClass: 'overview'
        })
        .state({
          name: 'app.auth.event',
          url:'/event/:id',
          views: {
            'content@app.auth': {
              template: `<gh-event></gh-event>`
            }
          },
          bodyClass: 'event'
        })
        .state({
          name: 'app.auth.participant',
          url:'/participant/:id',
          views: {
            'content@app.auth': {
              template: `<gh-participant></gh-participant>`
            }
          },
          bodyClass: 'participant'
        })
  }
})(angular);