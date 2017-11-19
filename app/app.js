/**
 * Created by SNSukhanov on 05.07.2017.
 */
let app = angular
    .module('core', [
      'ui.router',
      'ui-notification',
      'pascalprecht.translate',
      '720kb.datepicker',
      'ngDialog',
      'templates',
      'ui.bootstrap',
      'core.auth',
      'core.dashboard'
    ]);

app.config(function ($translateProvider, TRANSLATES, $windowProvider, ResourcesServiceProvider) {
  let siteId = ResourcesServiceProvider.getSiteId();
  if (siteId) {
    siteId = siteId.toUpperCase();
    $translateProvider.translations('en', TRANSLATES[siteId].EN);
    $translateProvider.translations('ru', TRANSLATES[siteId].RU);
    if (!$windowProvider.$get().localStorage.lang) {
      $windowProvider.$get().localStorage.lang = 'en';
      $translateProvider.preferredLanguage('en');
    } else {
      $translateProvider.preferredLanguage($windowProvider.$get().localStorage.lang);
    }
  }
});