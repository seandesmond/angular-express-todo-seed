/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('AccountCtrl', function ($scope, auth) {
        $scope.model.user = auth.currentUser();
    });
