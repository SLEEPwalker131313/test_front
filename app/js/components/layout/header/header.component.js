;(function (angular) {
  "use strict";

  angular.module("core")
      .component("ghHeader", {
        templateUrl: function(ResourcesService) {
          return ResourcesService.getTemplate('layout/header');
        },
        controller($translate, $state, $window, ApiService, AuthService, $http, LANGUAGES){
          let $ctrl = this;

          Object.assign($ctrl, {
            $onInit(){
              $ctrl.currentLang = $window.localStorage.lang ? $window.localStorage.lang : null;
              $http.defaults.headers.common['Accept-Language'] = $ctrl.currentLang;
              $ctrl.languages = [];
            },
            switchLang(key){
              $translate.use(key);
              $window.localStorage.lang = $ctrl.currentLang = key;
              $http.defaults.headers.common['Accept-Language'] = $window.localStorage.lang;
            },
            LANGUAGES,
            logout() {
              AuthService.logout();
            },
            currentLang: null
          })
        }
      })
})(angular);