;(function (angular) {
  "use strict";

    angular.module("core.auth")
        .component("ghLogin", {
            templateUrl: function (ResourcesService) {
                return ResourcesService.getTemplate('auth/login');
            },
            controller(AuthService){
                let $ctrl = this;

                Object.assign($ctrl, {
                    $onInit(){

                    },
                    login: function () {
                        AuthService.login($ctrl.form);
                    }
                })
            }
        })
})(angular);