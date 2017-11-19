;(function (angular) {
  'use strict';

  angular
      .module('core')
      .factory('NavigationService', function ($window, $state) {

        let parseState = function(state){
          var splitState = state.split('.');
          var root = splitState[0];
          var auth = splitState[1];
          var basic = splitState[2];
          splitState.shift();
          splitState.shift();
          splitState.shift();
          var other = splitState;
          return{
            root,
            auth,
            basic,
            other
          }
        };

        let currentStateOfNavigation = function(state){
          var navState = parseState(state);
          let cState = parseState($state.current.name);
          return cState.basic === navState.basic ? true : false;
        };

        return {
          currentStateOfNavigation,
          parseState,
          openMap(){
            var uluru = {lat: 59.963668, lng: 30.31998};
            var map = new google.maps.Map(document.getElementById("map"), {
              zoom: 14,
              center: uluru
            });

            var marker = new google.maps.Marker({
              position: uluru,
              map: map
            });
            return map;
          }
        }
      })
})(angular);