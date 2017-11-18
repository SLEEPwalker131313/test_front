;(function (angular) {
    'use strict';

    angular.module('core')
        .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
            'ngInject';

            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise("overview");

            $stateProvider
                .state('app', {
                    abstract: true
                })
                .state('app.auth', {
                    abstract: true,
                    views: {
                        '@': {
                            template: `<gh-layout-auth></gh-layout-auth>`
                        }
                    }

                })
                .state('app.non_auth', {
                    abstract: true,
                    views: {
                        '@': {
                            template: `<gh-layout-non-auth></gh-layout-non-auth>`
                        }
                    }
                })
        });
})(angular);