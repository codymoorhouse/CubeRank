(function(angular) {
    'use strict';
    var app = angular.module('login', []);

    app.controller('loginCtrl', ['$window', '$scope', '$http', function ($window, $scope, $http) {
        $scope.loginError = false;

        $scope.login = function (user) {
            if ($scope.loginUser.$valid) {
                if (user === undefined ||
                    user.username === undefined ||
                    user.password === undefined) {
                    return false;
                };

                $http.post("/login", $scope.user).then(function(response) {
                    $window.location.href = '/dashboard';
                }, function(response) {
                    $scope.loginError = true;
                    return false;
                });
            };
        }
    }]);
})(window.angular);
