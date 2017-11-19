;(function (angular) {
  "use strict";

  angular.module("core.dashboard")
      .component("ghParticipant", {
        templateUrl: function(ResourcesService) {
          return ResourcesService.getTemplate('dashboard/participant');
        },
        controller(ngDialog, $element, NavigationService){
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
            },

            openMentors(){
              ngDialog.open({
                template:'js/components/common/dialog/mentors.html'
              })
            },
            openMap(){
              ngDialog.open({
                template:'js/components/common/dialog/map.html',
                onOpenCallback(){
                  function createMap(){
                    var uluru = {lat: -25.363, lng: 131.044};
                    console.log($element);
                    console.log(google);
                    var map = NavigationService.openMap();
                  }
                  createMap();
                },
                controller(){
                  let $ctrlDialog = this;
                }
              })
            }
          })
        }
      })
})(angular);