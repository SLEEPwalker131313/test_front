;
(function (angular) {
    'use strict';
    angular
        .module('core')
        .constant('LANGUAGES', [
            {
                title: 'BUTTONS.EN',
                key: 'en'
            },
            {
                title: 'BUTTONS.RU',
                key: 'ru'
            }
        ]);
})(angular);