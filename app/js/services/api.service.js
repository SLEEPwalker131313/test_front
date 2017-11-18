;(function (angular) {
  'use strict';

  angular
      .module('core')
      .factory('ApiService', function ($http, $httpParamSerializer, $window, ResourcesService, $q) {

        const ROOT_URL = '';
        const BASE_URL = '';
        const VERSION_URL = '';

        const PATHS = {

        };

        let getApiUrl = function () {
          return ROOT_URL + BASE_URL + VERSION_URL;
        };

        // let getLanguageParam = function () {
        //   let lang = $window.localStorage.lang || 'en';
        //   return '?lang=' + lang;
        // };

        let _request = function (options) {
          return $http(options).then(function(resp){
            return resp;
          }, function(err){
            console.log(err);
          });
        };

        let _get = function (url) {
          return _request({
            method: "GET",
            url: url
          })
        };

        let _post = function (url, data) {
          return _request({
            method: "POST",
            url: url,
            data: data || {}
          })
        };

        let _put = function (url, data) {
          return _request({
            method: "PUT",
            url: url,
            data: data || {}
          })
        };

        let _delete = function (url) {
          return _request({
            method: "DELETE",
            url: url
          })
        };


        return {
          get: _get,
          post: _post,
          put: _put,
          delete: _delete,

          auth:{
            login(){
              return $q.when({}).then(function(){
                return {
                  data:{
                    accessToken:"12312312312"
                  }
                }
              });
            },
            currentUser(){
              return $q.when({}).then(function(){
                return JSON.parse(window.localStorage.getItem('user'))
              });
            },
            logout(){
              return $q.when({}).then(function(){
                return null;
              });
            }
          }

        }
      })
})(angular);