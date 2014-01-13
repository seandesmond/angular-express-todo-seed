/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('AccountCtrl', function ($scope, user) {
        $scope.model.user = user.currentUser();
    });
