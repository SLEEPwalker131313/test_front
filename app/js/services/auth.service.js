;(function (angular) {
  'use strict';

  angular
      .module('core')
      .factory('AuthService', function (ApiService, $window, $http, $q, $state) {
        let CurrentUser = null;
        let authentication = false;

        let setHeaderToken = function (token) {
          if (token) {
            $http.defaults.headers.common['Access-Token'] = token;
          }
        };

        let saveToken = function (token) {
          $window.localStorage['token'] = token;
        };

        let getToken = function () {
          return $window.localStorage['token'];
        };

        let removeToken = function () {
          $window.localStorage.removeItem('token');
        };

        let isAuthentication = function () {
          return authentication;
        };

        let clearSession = function () {
          authentication = false;
          CurrentUser = null;
          removeToken();
          setHeaderToken(null);
          window.localStorage.clear();
          $state.go('app.non_auth.login');
        };

        let login = function (form, errorCallback) {
          return ApiService.auth.login({
            username:form.login,
            password:form.password
          }).then(function (resp) {
            authentication = true;
            if (resp.data && resp.data.accessToken) {
              saveToken(resp.data.accessToken);
              setHeaderToken(resp.data.accessToken);
              window.localStorage.setItem('user', JSON.stringify({
                avatar:'/images/avatar.png',
                user:form
              }));
            }
            $state.go('app.auth.overview');
            return resp;
          }, errorCallback)
        };

        let logout = function () {
          return ApiService.auth.logout().then(function () {
            clearSession();
          }, function (err) {
            console.error('error logout', err);
            return err;
          })
        };

        let checkUser = function(){
          let token = getToken();
          let promise = $q.when({});
          authentication = token ? true : false;
          if (CurrentUser) {
            promise = $q.when(CurrentUser);
          } else {
            if (token) {
              setHeaderToken(token);
              promise = ApiService.auth.currentUser().then(function (data) {
                CurrentUser = data;
                return data;
              }, function () {
                clearSession();
                $state.go('app.non_auth.login');
              })
            }
          }

          return promise;
        };

        let getUser = function(){
          return ApiService.auth.currentUser();
        };

        return {
          isAuthentication,
          clearSession,
          setHeaderToken,
          login,
          logout,
          getUser,
          setAvatar(avatar){
            CurrentUser.avatar = avatar;
            console.log(CurrentUser);
          },
          checkUser
        }
      });
})(angular);