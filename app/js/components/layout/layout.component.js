;(function (angular) {
    "use strict";

    angular.module("core")
        .component("appLayout", {
            templateUrl: function(ResourcesService) {
                return ResourcesService.getTemplate('layout');
            },
            controller(){
                let $ctrl = this;

                Object.assign($ctrl, {

                })
            }
        })
})(angular);