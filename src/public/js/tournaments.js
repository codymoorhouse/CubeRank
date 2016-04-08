
var app = angular.module('tournaments', []);
app.controller('tournamentController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $http.get("/api/v1/tournaments").then(function (response) {
        $scope.tournaments = response.data.data;


        $scope.heading = 'Tournaments';
        $timeout(function () {
            $('#leagues-table').dataTable();
        }, 0);
    });
}]);