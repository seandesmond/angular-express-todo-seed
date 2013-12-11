/*global angular: false */

'use strict';
angular.module('publicApp')
    .service('auth', function Auth() {
        var currentUser, redirect = '/todos';

        function getCurrentUser() {
            if (!currentUser && Storage && sessionStorage.currentUser) {
                currentUser = JSON.parse(sessionStorage.currentUser);
            }

            return currentUser;
        }

        return {
            update: function (info) {
                currentUser = currentUser ? angular.extend(currentUser, info) : info;
                sessionStorage.currentUser = JSON.stringify(currentUser);
            },
            clear: function () {
                currentUser = sessionStorage.currentUser = null;
            },
            currentUser: function () {
                return getCurrentUser();
            },
            redirect: redirect
        };
    });
