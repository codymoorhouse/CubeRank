var app = angular.module('orgs', []);
app.controller('MainController', function($scope, $http, $timeout, $window) {
    $http.get("/api/v1/leagues").then(function (response) {
        console.log(response.data.data);
        $scope.leagues = response.data.data;
        $scope.heading = 'Leagues';
        $timeout(function () {
            $('#leagues-table').dataTable();
        }, 0);
    });
});