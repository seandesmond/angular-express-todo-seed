/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('LoginCtrl', function ($scope, $http, $timeout, $location, user) {
        var unknownErr = 'Unknown error has occurred. Please try again ' +
            'or contact to-do admin for assistance.';

        $scope.model = {posting: false};

        $scope.login = function (userInfo) {
            $scope.model.submitError = null;
            $scope.model.validationError = $scope.loginForm.$invalid;
            if (!$scope.model.validationError) {
                $scope.model.posting = true;
                $http.post('/user/login', userInfo.auth)
                    .success(function (data) {
                        user.update(data);
                        $location.path(user.redirect || '/');
                    })
                    .error(function (err) {
                        $scope.model.posting = false;
                        $scope.model.submitError = err || unknownErr;
                    });
            }
        };
    });
