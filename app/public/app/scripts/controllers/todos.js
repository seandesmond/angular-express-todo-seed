/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('TodosCtrl', function ($scope, $timeout, todo) {
        $scope.model = {
            minDate: new Date(),
            todos: [],
            sortedBy: 'text',
            sortReverse: false
        };

        todo.query(function (data) {
            $scope.model.todos = data;
        });

        $scope.create = function (newTodo) {
            if (!$scope.todoForm.$invalid) {
                todo.save({}, newTodo, function (data) {
                    $scope.model.todos.push(data);
                    $scope.model.saveError = '';
                    $scope.model.newTodo = {};
                }, function (data, status, headers, config) {
                    $scope.model.saveError = data;
                });
            }
        };

        $scope.setComplete = function (todoToUpdate) {
            /* We need to save on the next digest to let the 'complete' binding take place */
            $timeout(function () {
                todoToUpdate.$save({id: todoToUpdate._id});
            });
        };

        $scope.removeComplete = function () {
            $scope.model.todos.forEach(function (todo) {
                if (todo.complete) {
                    todo.$delete({id: todo._id}, function () {
                        $scope.model.todos.splice($scope.model.todos.indexOf(todo), 1);
                    });
                }
            });
        };

        $scope.openCal = function () {
            $timeout(function () {
                $scope.model.calOpened = true;
            });
        };

        $scope.sortBy = function (param) {
            if (param === $scope.model.sortedBy) {
                $scope.model.reverse = !$scope.model.reverse;
            } else {
                $scope.model.reverse = false;
            }

            $scope.model.todos.sort(function (a, b) {
                var aParam = angular.isDefined(a[param]) ? a[param] : '',
                    bParam = angular.isDefined(b[param]) ? b[param] : '';
                if (aParam < bParam) { return $scope.model.reverse ? 1 : -1; }
                if (aParam > bParam) { return $scope.model.reverse ? -1 : 1; }
                return 0;
            });

            $scope.model.sortedBy = param;
        };
    });
