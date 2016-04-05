angular.module('create_org', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/orgs/:id/edit', {
            controller: 'UpdateOrgController'
        });

        $locationProvider.html5Mode({enabled: true, requireBase: false});
    })

    .controller('UpdateOrgController', function ($scope, $http, $routeParams, $window) {

        $scope.$on('$routeChangeSuccess', function () {
            $http.get("/api/v1/orgs/" + $routeParams.id).then(function (response) {
                $scope.org = response.data.data[0];
                $scope.name = response.data.data[0].name;
            })
        });

        $scope.update = function (org) {
            $http.put("/api/v1/orgs/" + $routeParams.id, org).then(function (response) {
                $scope.response = response.status;
                if (response.status == 200)
                    $window.location.href = "/orgs/" + $routeParams.id;
                else
                    $window.alert(response.statusText);
            });
        }
    });