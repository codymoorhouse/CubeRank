var app = angular.module('orgs', ['ngRoute']);

app.controller('TabsController', function() {
    this.tab = 1;

    this.setTab = function(tab) {
        this.tab = tab;
    };

    this.isSet = function(tab) {
        return this.tab === tab;
    }
});

app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/orgs/:id', {
        controller: 'MainController'
    });

    $locationProvider.html5Mode({enabled: true, requireBase: false});
});

app.controller('MainController', function($scope, $routeParams, $http, $timeout, $window) {
    $scope.$on('$routeChangeSuccess', function() {
        $http.get("/api/v1/orgs/" + $routeParams.id).then(function (response) {
            $scope.org = response.data.data[0];
        });
        $http.get("/api/v1/orgs/" + $routeParams.id + "/users").then(function (response) {
            $scope.users = response.data.data;
            $timeout(function() {
                $('#users-table').dataTable();
            }, 0);
        });

        $http.get("/api/v1/orgs/" + $routeParams.id + "/leagues").then(function (response) {
            $scope.leagues = response.data.data;
        })
    });

    this.delete = function() {
        $http.delete('/api/v1/orgs/' + $routeParams.id).then(function(response) {
            $scope.response = response.data.statusCode;
            if (response.data.statusCode == 200)
                $window.location.href ="/orgs";
            else
                $window.alert('Unsuccessful');
        });
    }
});