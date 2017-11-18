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
              $ctrl.data = [
                {
                  name:'Sergey',
                  project:'Project 1',
                  lang:'javascript',
                  level:5,
                  avatar:'avatar.jpg'
                },
                {
                  name:'Sergey 2',
                  project:'Project 2',
                  lang:'C#',
                  level:5,
                  avatar:'avatar.jpg'
                },
                {
                  name:'Sergey 3',
                  project:'Project 3',
                  lang:'java',
                  level:5,
                  avatar:'avatar.jpg'
                },
                {
                  name:'Sergey 4',
                  project:'Project 4',
                  lang:'C#',
                  level:5,
                  avatar:'avatar.jpg'
                }
              ]
            }
          })
        }
      })
})(angular);