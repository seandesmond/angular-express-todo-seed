/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('LoginCtrl', function ($scope, $http, $timeout, auth) {
        var unknownErr = 'Unknown error has occurred. Please try again ' +
            'or contact to-do admin for assistance.';

        $scope.login = function (user) {
            $scope.model.submitError = null;
            $scope.model.validationError = $scope.loginForm.$invalid;
            if (!$scope.model.validationError) {
                $scope.model.posting = true;
                $http.post('/user/login', {email: user.email, password: user.password})
                    .success(function (data) {
                        auth.update(data);

                    })
                    .error(function (err, status) {
                        $scope.model.posting = false;
                        $scope.model.submitError = err.message || unknownErr;
                    });
            }
        };
    });
