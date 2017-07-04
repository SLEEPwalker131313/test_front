;(function (angular) {
  'use strict';

  angular.module('core').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    'ngInject';

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/home");

    $stateProvider.state('app', {
      abstract: true,
      views: {
        '@': {
          template: '<app-layout></app-layout>'
        }
      }

    }).state('app.auth', {
      abstract: true
    }).state('app.non_auth', {
      abstract: true
    });
  });
})(angular);