;(function (angular) {
    'use strict';

    angular.module('core')
        .run(function ($rootScope, $state, $window) {
            'ngInject';

            $rootScope.go = $state.go;

            $rootScope.$on('$stateChangeStart', function () {
                console.log(arguments);
            });

            $rootScope.$on('$stateNotFound', function () {

            });console.log(arguments);

            $rootScope.$on('$stateChangeSuccess', function () {
                console.log(arguments);
            });

            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                console.log(error);
            });

            $rootScope.state = $state;
        });
})(angular);