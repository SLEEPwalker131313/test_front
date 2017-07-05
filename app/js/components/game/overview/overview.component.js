

;(function (angular) {
    "use strict";

    angular.module("core.game")
        .component("appOverview", {
            templateUrl: function(ResourcesService) {
                return ResourcesService.getTemplate('game/overview');
            },
            controller($translate, $window, LANGUAGES, $http){
                let $ctrl = this;

                Object.assign($ctrl, {
                    $onInit(){
                        $ctrl.currentLang = $window.localStorage.lang ? $window.localStorage.lang : null;
                        $http.defaults.headers.common['Accept-Language'] = $ctrl.currentLang;
                    },
                    LANGUAGES,
                    switchLang(key){
                        $translate.use(key);
                        $window.localStorage.lang = $ctrl.currentLang = key;
                        $http.defaults.headers.common['Accept-Language'] = $window.localStorage.lang;
                    }
                })
            }
        })
})(angular);