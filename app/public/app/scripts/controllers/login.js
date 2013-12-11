/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('LoginCtrl', function ($scope, $http, $timeout, $location, auth) {
        var unknownErr = 'Unknown error has occurred. Please try again ' +
            'or contact to-do admin for assistance.';

        $scope.model = {posting: false};

        $scope.login = function (user) {
            $scope.model.submitError = null;
            $scope.model.validationError = $scope.loginForm.$invalid;
            if (!$scope.model.validationError) {
                $scope.model.posting = true;
                $http.post('/user/login', user)
                    .success(function (data) {
                        auth.update(data);
                        $location.path(auth.redirect || '/');
                    })
                    .error(function (err, status) {
                        $scope.model.posting = false;
                        $scope.model.submitError = err || unknownErr;
                    });
            }
        };
    });
