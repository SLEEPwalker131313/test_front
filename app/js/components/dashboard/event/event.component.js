;(function (angular) {
  "use strict";

  angular.module("core.dashboard")
      .component("ghEvent", {
        templateUrl: function(ResourcesService) {
          return ResourcesService.getTemplate('dashboard/event');
        },
        controller(){
          let $ctrl = this;

          Object.assign($ctrl, {
            $onInit(){
            }
          })
        }
      })
})(angular);