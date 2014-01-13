/*global angular: false */

'use strict';
angular.module('publicApp', ['ui.bootstrap', 'ui.validate', 'ui.keypress', 'ngRoute', 'ngAnimate', 'ngResource'])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/', {templateUrl: '/views/home.html'})
            .when('/login', {templateUrl: '/views/login.html', controller: 'LoginCtrl'})
            .when('/register', {templateUrl: 'views/register.html', controller: 'RegisterCtrl'})
            .when('/todos', {templateUrl: 'views/todos.html', controller: 'TodosCtrl'})
            .when('/account', {
                templateUrl: 'views/account.html',
                controller: 'AccountCtrl'
            })
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true).hashPrefix('!');

        /* Taken in part from: http://www.espeo.pl/2012/02/26/authentication-in-angularjs-application */
        var interceptor = ['$q', '$location', 'user', function ($q, $location, user) {
            function success(response) {
                return response;
            }

            function error(response) {
                var status = response.status;
                if (status === 401) {
                    user.redirect = $location.url();
                    $location.path('/login');
                }

                return $q.reject(response);
            }

            return function (promise) {
                return promise.then(success, error);
            };
        }];

        $httpProvider.responseInterceptors.push(interceptor);
    })
    .run(function ($rootScope, $http, user) {
        $http.get('/user').success(function (data) {
            user.update(data);
        }).error(function () {
            user.clear();
        });
    });
