/*global angular: false */

'use strict';
angular.module('publicApp')
    .service('todo', function Todo($resource) {
        return $resource('api/Todo/:id', {}, {});
    });
