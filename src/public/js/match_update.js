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
                $scope.match_result = response.data.data[0].match_result;
                $scope.user1_id = response.data.data[0].user1_id;
                $scope.user2_id = response.data.data[0].user2_id;
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