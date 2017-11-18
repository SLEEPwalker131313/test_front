;(function (angular) {
  "use strict";

  angular.module("core")
      .component("ghFooter", {
        templateUrl: function(ResourcesService) {
          return ResourcesService.getTemplate('layout/footer');
        },
        controller(){
          let $ctrl = this;

          Object.assign($ctrl, {

          })
        }
      })
})(angular);