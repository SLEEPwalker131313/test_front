;(function (angular) {
    'use strict';

    angular.module('core')
        .run(function ($rootScope, $state, $window, AuthService) {
            'ngInject';

            const DEFAULT_PAGE = 'app.auth.overview';
            const LOGIN_PAGE = 'app.non_auth.login';

            $rootScope.go = $state.go;

            $rootScope.$on('$stateChangeStart', function () {
                let stateAuth = arguments[1].name.split('.')[1];
                $rootScope.loadingProgress = true;
                AuthService.checkUser().then(function () {
                    if (AuthService.isAuthentication()) {
                        if (stateAuth === 'non_auth') {
                            $state.go(DEFAULT_PAGE);
                        }
                    } else {
                        if (stateAuth === 'auth') {
                            $state.go(LOGIN_PAGE);
                        }
                    }
                })
            });

            $rootScope.$on('$stateNotFound', function () {});

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
                $rootScope.startBreadcrumbsState = toState;
                $rootScope.startBreadcrumbsParams = toParams;
                $rootScope.loadingProgress = false;
            });

            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                console.log(arguments)
            });

            $rootScope.state = $state;
            $rootScope.startBreadcrumbs = {};
        });
})(angular);