;(function (angular) {
    'use strict';

    angular.module('core')
        .provider('ResourcesService', function ResourcesServiceProvider() {

            let siteId = 'game';


            this.getSiteId = function () {
                return siteId;
            };

            this.$get = function ResourcesServiceFactory() {

                /**
                 * @param template - имя html шаблона
                 * @param uniqueTemplates - массив с идентификаторами сайта для которых необходим уникальный template
                 * @returns {string}
                 */
                let getTemplate = function (template, uniqueTemplates = []) {

                    let pathArray = template.split('/');
                    let file = pathArray.slice(-1)[0];
                    let path = "js/components/" + pathArray.join('/') + '/';

                    if (uniqueTemplates.indexOf(siteId) != -1) {
                        file = file + '-' + siteId;
                    }

                    return path + file + '.html'
                };

                let getSiteId = function () {
                    return siteId;
                };

                let setSiteId = function (id) {
                    siteId = id;
                };

                return {
                    getTemplate,
                    getSiteId,
                    setSiteId
                };
            };
        });
})(angular);