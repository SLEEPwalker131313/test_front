;(function (angular) {
  "use strict";

  angular.module("core.dashboard")
      .component("ghOverview", {
        templateUrl: function(ResourcesService) {
          return ResourcesService.getTemplate('dashboard/overview');
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