var app = angular.module('league', ['ngRoute']);

app.controller('TabsController', function() {
    this.tab = 1;

    this.setTab = function(tab) {
        this.tab = tab;
    };

    this.isSet = function(tab) {
        return this.tab === tab;
    };
});

app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/leagues/:id', {
        controller: 'MainController'
    });

    $locationProvider.html5Mode({enabled: true, requireBase: false});
});

app.controller('MainController', function($scope, $routeParams, $http, $timeout, $window) {
    $scope.$on('$routeChangeSuccess', function() {
        $http.get("/api/v1/leagues/" + $routeParams.id).then(function (response) {
            $scope.league = response.data.data[0];
        });

        $http.get("/api/v1/leagues/" + $routeParams.id + "/users").then(function (response) {
            $scope.users = response.data.data;
            console.log($scope.users);
            $timeout(function() {
                $('#users-table').dataTable();
            }, 0);
        });

        $http.get("/api/v1/leagues/" + $routeParams.id + "/tournaments").then(function (response) {
            $scope.tournaments = response.data.data;
        })
    });

    this.delete = function() {
        $http.delete('/api/v1/leagues/' + $routeParams.id).then(function(response) {
            $scope.response = response.data.statusCode;
            if (response.data.statusCode == 200)
                $window.location.href ="/orgs/" + $scope.league.organization_id;
            else
                $window.alert('Unsuccessful');
        });
    }
});