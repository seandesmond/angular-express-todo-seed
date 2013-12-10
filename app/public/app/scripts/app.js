/*global angular: false */

'use strict';
angular.module('publicApp', ['ui.bootstrap', 'ui.validate', 'ngRoute', 'ngAnimate', 'ngResource'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {templateUrl: '/views/main.html', controller: 'MainCtrl'})
            .when('/login', {templateUrl: '/views/login.html', controller: 'LoginCtrl'})
            .when('/register', {templateUrl: 'views/register.html', controller: 'RegisterCtrl'})
            .when('/todos', {templateUrl: 'views/todos.html', controller: 'TodosCtrl'})
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true).hashPrefix('!');
    });
