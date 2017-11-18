;(function (angular) {
  "use strict";

  angular.module("core.dashboard")
      .component("ghParticipant", {
        templateUrl: function(ResourcesService) {
          return ResourcesService.getTemplate('dashboard/participant');
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