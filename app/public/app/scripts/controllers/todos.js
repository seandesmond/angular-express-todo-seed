/*global angular: false */

'use strict';
angular.module('publicApp')
    .controller('TodosCtrl', function ($scope, $timeout, todo) {
        $scope.model = {
            minDate: new Date(),
            todos: [],
            sortedBy: 'text',
            sortReverse: false,
            numComplete: 0,
            loadingTodos: true,
            commErrorTimeout: null
        };

        function setCommError(err) {
            $scope.model.commError = (typeof err === 'string') ? err :
                    (err.message || 'Could not communicate with server. Are you still online?');
            if ($scope.model.commErrorTimeout) { $timeout.cancel($scope.model.commErrorTimeout); }
            $scope.model.commErrorTimeout = $timeout(function () { $scope.model.commError = ''; }, 10000);
        }

        todo.query(function (data) {
            $scope.model.todos = data;
            $scope.model.todos.forEach(function (todo) {
                if (todo.complete) { $scope.model.numComplete++; }
            });

            $scope.model.loadingTodos = false;
        });

        $scope.createTodo = function (newTodo) {
            if (!$scope.todoForm.$invalid) {
                todo.save({}, newTodo, function (data) {
                    $scope.model.todos.push(data);
                    $scope.model.saveError = '';
                    $scope.model.newTodo = {};
                }, function (err) {
                    setCommError(err);
                });
            }
        };

        $scope.saveTodo = function (todo) {
            if (todo) {
                todo.$save({id: todo._id}, null, function (err) { setCommError(err); });
            }
        };

        $scope.deleteTodo = function (todo, event) {
            if (event) { event.stopPropagation(); }
            if (todo) {
                todo.$delete({id: todo._id}, function () {
                    if (todo.complete) { $scope.model.numComplete--; }
                    $scope.model.todos.splice($scope.model.todos.indexOf(todo), 1);
                }, function (err) {
                    setCommError(err);
                });
            }
        };

        $scope.setComplete = function (todoToUpdate, event) {
            if (event) { event.stopPropagation(); }

            /* We need to save on the next digest to let the 'complete' binding take place */
            $timeout(function () {
                $scope.saveTodo(todoToUpdate);
                $scope.model.numComplete = todoToUpdate.complete ?
                        $scope.model.numComplete + 1 : $scope.model.numComplete - 1;
            });
        };

        $scope.removeComplete = function () {
            $scope.model.todos.forEach(function (todo) {
                if (todo.complete) {
                    $scope.deleteTodo(todo);
                }
            });

            $scope.model.numComplete = 0;
        };

        $scope.openCal = function () {
            $timeout(function () { $scope.model.calOpened = true; });
        };

        $scope.openEditCal = function () {
            $timeout(function () { $scope.model.editCalOpened = true; });
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

        $scope.editItem = function (event, index) {
            event.stopPropagation();
            $scope.model.editIndex = index;
        };

        $scope.$on('event:enterPressed', function () {
            $scope.saveTodo(($scope.model.editIndex !== -1) ?
                    $scope.model.todos[$scope.model.editIndex] : null);
            $scope.model.editIndex = -1;
        });

        $scope.$on('event:bodyClicked', function () {
            $scope.saveTodo(($scope.model.editIndex !== -1) ?
                    $scope.model.todos[$scope.model.editIndex] : null);
            $scope.model.editIndex = -1;
        });
    });
