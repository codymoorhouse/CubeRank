var app = angular.module('matches', []);
app.controller('MainController', function($scope, $http, $timeout, $window) {
    $http.get("/api/v1/matches").then(function(response) {
        $scope.matches = response.data.data;
        $scope.heading = 'Matches';
        $timeout(function(){
            $('#matches-table').dataTable();
        }, 0);
    });
});