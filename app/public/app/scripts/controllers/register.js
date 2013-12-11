/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('RegisterCtrl', function ($scope, $http, $timeout, $location, auth) {
        var validationTimeout,
            unknownErr = 'Unknown error has occurred. Please try again ' +
                'or contact to-do admin for assistance.';

        function checkUnique(username) {
            if (validationTimeout) { $timeout.cancel(validationTimeout); }
            validationTimeout = $timeout(function () {
                if (username) {
                    $http.head('/user?username=' + username).success(function () {
                        $scope.model.usernameCollision = true;
                    }).error(function (err, status) {
                        $scope.model.usernameCollision = false;
                    });
                } else {
                    $scope.model.usernameCollision = false;
                }
            }, 500);
        }

        $scope.model = {usernameCollision: false, posting: false};

        $scope.register = function (user) {
            $scope.model.validationError = $scope.registerForm.$invalid || $scope.model.usernameCollision;
            if (!$scope.model.validationError) {
                $scope.model.posting = true;
                $http.post('/user/register', user)
                    .success(function (data) {
                        auth.update(data);
                        $location.path('/todos');
                    })
                    .error(function (err, status) {
                        $scope.model.posting = false;
                        $scope.model.submitError = err || unknownErr;
                    });
            }
        };

        $scope.$watch('model.user.username', function (val) {
            checkUnique(val);
        });
    });
