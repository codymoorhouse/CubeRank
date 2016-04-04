(function(angular) {
    'use strict';
    var app = angular.module('match', []);

    app.controller('matchCtrl', ['$window', '$scope', '$http', function ($window, $scope, $http) {
        $scope.master = {};

        $http.get("api/v1/leagues/1/matches").then(function(response) {

            $scope.signup = response.data.data;

            $scope.create = function (match) {
                $http.post("api/v1/leagues/1/matches", match).then(function (response) {
                    /* Redirect after user is created */
                    $window.location.href = '/match';
                });
            }
        });

        $scope.create = function (match) {
            $scope.master = angular.copy(match);
        };
    }]);

})(window.angular);