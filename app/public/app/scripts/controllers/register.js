/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('RegisterCtrl', function ($scope, $http, $timeout, $location, user) {
        var validationTimeout,
            unknownErr = 'Unknown error has occurred. Please try again ' +
                'or contact to-do admin for assistance.';

        function checkUnique(username) {
            if (validationTimeout) { $timeout.cancel(validationTimeout); }
            validationTimeout = $timeout(function () {
                if (username) {
                    $http.head('/user?username=' + username).success(function () {
                        $scope.model.usernameCollision = true;
                    }).error(function () {
                        $scope.model.usernameCollision = false;
                    });
                } else {
                    $scope.model.usernameCollision = false;
                }
            }, 500);
        }

        $scope.model = {usernameCollision: false, posting: false};

        $scope.register = function (newUser) {
            $scope.model.validationError = $scope.registerForm.$invalid || $scope.model.usernameCollision;
            if (!$scope.model.validationError) {
                $scope.model.posting = true;
                $http.post('/user/register', newUser)
                    .success(function (data) {
                        user.update(data);
                        $location.path('/todos');
                    })
                    .error(function (err) {
                        $scope.model.posting = false;
                        $scope.model.submitError = err || unknownErr;
                    });
            }
        };

        $scope.$watch('model.user.auth.username', function (val) {
            checkUnique(val);
        });
    });
