
var app = angular.module('tournaments', []);
app.controller('tournamentController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $http.get("/api/v1/tournaments").then(function (response) {
        $scope.tournaments = response.data.data;

        for (var i = 0; i < $scope.tournaments.length; i++){
            var league_id = $scope.tournaments[i].league_id;
            $http.get('/api/v1/leagues/'+league_id).then(function(response){
                $scope.league_name = response.data.data.title;
            });
        }
        $scope.heading = 'Tournaments';
        $timeout(function () {
            $('#leagues-table').dataTable();
        }, 0);
    });
}]);


