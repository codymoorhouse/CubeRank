angular.module('create_league', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/orgs/:id/create-league', {
            controller: 'CreateLeagueController'
        });

        $locationProvider.html5Mode({enabled: true, requireBase: false});
    })

    .controller('UpdateOrgController', function ($scope, $http, $routeParams, $window) {

        $scope.$on('$routeChangeSuccess', function () {
            $http.get("/api/v1/orgs/" + $routeParams.id).then(function(response) {
                $scope.orgname = response.data.data[0].name;
                $scope.league = {};
                $scope.league.organization_id = $routeParams.id;
            })
        });

        $scope.create = function (league) {
            $http.post("/api/v1/orgs/" + $routeParams.id + '/leagues', league).then(function (response) {
                if (response.status === 200)
                    $window.location.href = "/orgs/"  + $routeParams.id;
                else
                    $window.alert(response.statusText);
            });
        }
    });