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
          parseState
        }
      })
})(angular);