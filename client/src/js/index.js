/**
 * Created by SNSukhanov on 03.07.2017.
 */

var APP = {};

;(function(){
  'use strict';

  APP.Run = function(name){
    this.appName = name;

    this.init = function(){
        console.log('App is run: ' + this.appName);
        var router = new APP.Router().init();
        var models = new APP.Models().init();
        var services = new APP.Services().init();
    }

  };


  APP.Models = function(){
    this.init = function(){
      console.log('Models is run');
    }
  };

  APP.Services = function(){
    this.init = function(){
      console.log('Services is run');
    }
  };

  APP.Router = function(){
    this.init = function(){
      console.log('Router is run');
    }
  }
})();