/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('MainCtrl', function ($scope, $http, $location, user) {
        $scope.model = { currentUser: user.currentUser, location: $location };

        $scope.logout = function () {
            user.clear();
            $http.post('user/logout', {});
            $scope.$broadcast('event:loggedOut', null);
            $location.path('/');
        };

        $scope.bodyClicked = function () {
            $scope.$broadcast('event:bodyClicked', {});
        };

        $scope.enterPressed = function () {
            $scope.$broadcast('event:enterPressed', {});
        };
    });
