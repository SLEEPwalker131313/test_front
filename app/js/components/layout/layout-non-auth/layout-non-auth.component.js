;(function (angular) {
  "use strict";

  angular.module("core")
      .component("ghLayoutNonAuth", {
        templateUrl: function(ResourcesService) {
          return ResourcesService.getTemplate('layout/layout-non-auth');
        },
        controller(){
          let $ctrl = this;

          Object.assign($ctrl, {

          })
        }
      })
})(angular);