/**
 * Created by SNSukhanov on 23.06.2017.
 */
;(function(angular){
  'use strict';
  angular.module('core')
      .run(function($rootScope, $state, $window){
        'ngInject';

        $rootScope.$on('$stateChangeStart', function(){
          console.log(arguments);
        });

        $rootScope.$on('$stateNotFound', function(){
          console.log(arguments);
        });

        $rootScope.$on('$stateChangeSuccess', function(){
          console.log(arguments);
        });

        $rootScope.$on('$stateChangeError', function(){
          console.log(arguments);
        });

        $rootScope.state = $state;

      });
})(angular);