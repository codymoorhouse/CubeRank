
angular.module('edit_league', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/leagues/:id/edit', {
            controller: 'EditLeagueController'
        });

        $locationProvider.html5Mode({enabled: true, requireBase: false});
    })

    .controller('EditLeagueController', function ($scope, $http, $routeParams, $window) {

        $scope.$on('$routeChangeSuccess', function () {
            $http.get("/api/v1/leagues/" + $routeParams.id).then(function(response) {
                $scope.league = response.data.data[0];
                console.log($scope.league);
            })
        });

        $scope.update = function (league) {
            $http.put("/api/v1/leagues/" + $routeParams.id, league).then(function (response) {
                if (response.status === 200)
                    $window.location.href = "/orgs/"  + $scope.league.organization_id;
                else
                    $window.alert(response.statusText);
            });
        }
    });