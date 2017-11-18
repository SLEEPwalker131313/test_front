;(function (angular) {
  "use strict";

  angular.module("core")
      .component("ghLayoutAuth", {
        templateUrl: function(ResourcesService) {
          return ResourcesService.getTemplate('layout/layout-auth');
        },
        controller(){
          let $ctrl = this;

          Object.assign($ctrl, {

          })
        }
      })
})(angular);