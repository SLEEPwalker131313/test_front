/**
 * Created by SNSukhanov on 05.07.2017.
 */

;
(function (angular) {
  'use strict';

  angular.module('core.game', [])
      .config(config);

  function config($stateProvider) {
    $stateProvider
        .state({
          name: 'app.auth.overview',
          url:'/overview',
          views: {
            'content@app': {
              template: `<app-overview></app-overview>`
            }
          },
          bodyClass: 'overview'

        })
  }
})(angular);