/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('TodosCtrl', function ($scope, todo) {
        todo.query(function (data) { $scope.todos = data; });

        $scope.createTodo = function (todo) {
            if (!$scope.todoForm.$invalid) {
                todo.save({}, $scope.newTodo, function (data) {
                    $scope.todos.push(data);
                    $scope.saveError = '';
                    $scope.newTodo = {};

                }, function (data, status, headers, config) {
                    $scope.saveError = data;
                });
            }
        };

        $scope.setComplete = function (todo) {
            todo.$save({id: todo._id});
        };

        $scope.removeComplete = function () {
            $scope.todos.forEach(function (todo) {
                if (todo.complete) {
                    todo.$delete({id: todo._id}, function () {
                        $scope.todos.splice($scope.todos.indexOf(todo), 1);
                    });
                }
            });
        };
    });
