/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('MainCtrl', function ($scope, auth) {
        $scope.model = { loggedIn: false };

        $scope.logout = function () {
            auth.clear();
            $scope.$broadcast('event:loggedOut', null);
        };

        $scope.loggedIn = function () {
            return auth.isAuthenticated();
        };

        $scope.getUserName = function () {
            return auth.currentUser() ? (auth.currentUser().name || auth.currentUser().email) : '';
        };
    });
