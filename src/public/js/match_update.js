angular.module('create_match', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/matches/:id/edit', {
            controller: 'UpdateMatchController'
        });

        $locationProvider.html5Mode({enabled: true, requireBase: false});
    })

    .controller('UpdateMatchController', function ($scope, $http, $routeParams, $window) {

        $scope.$on('$routeChangeSuccess', function () {
            $http.get("/api/v1/matches/" + $routeParams.id).then(function (response) {
                $scope.match = response.data.data[0];
                $scope.winner = response.data.data[0].winner;
            })
        });

        $scope.update = function (match) {
            $http.put("/api/v1/matches/" + $routeParams.id, match).then(function (response) {
                $scope.response = response.status;
                if (response.status == 200)
                    $window.location.href = "/matches";
                else
                    $window.alert(response.statusText);
            });
        }
    });