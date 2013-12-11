/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('MainCtrl', function ($scope, $http, $location, auth) {
        $scope.model = { currentUser: auth.currentUser, location: $location };

        $scope.logout = function () {
            auth.clear();
            $http.post('user/logout', {});
            $scope.$broadcast('event:loggedOut', null);
            $location.path('/');
        };
    });
