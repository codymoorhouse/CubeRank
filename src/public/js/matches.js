var app = angular.module('matches', []);
app.controller('MainController', function($scope, $http, $timeout, $window) {
    $http.get("/api/v1/matches").then(function(response) {
        $scope.matchList = [];

        for (var i = 0; i < response.data.data.length; i++) {
            $scope.newMatch = {
                match_id: response.data.data[i]['match_id'],
                league_id: response.data.data[i]['league_id'],
                league_name: response.data.data[i]['league_name'],
                tournament_id: response.data.data[i]['tournament_id'],
                player1_id: response.data.data[i]['player1_id'],
                player1_name: response.data.data[i]['player1_name'],
                player2_id: response.data.data[i]['player2_id'],
                player2_name: response.data.data[i]['player2_name'],
                match_date: response.data.data[i]['match_date'],
                match_time: response.data.data[i]['match_time'],
                match_winner: response.data.data[i]['match_winner']
            }

            if ($scope.newMatch['player1_name'] === $scope.newMatch['match_winner']) {
                $scope.newMatch['match_winner_id'] = response.data.data[i]['player1_id'];
            } else if ($scope.newMatch['player2_name'] === $scope.newMatch['match_winner']) {
                $scope.newMatch['match_winner_id'] = response.data.data[i]['player2_id'];
            } else {
                $scope.newMatch['match_winner_id'] = -1;
            }

            $scope.matchList.push($scope.newMatch);
        }
        $scope.heading = 'Matches';
    }).then(function() {
        $timeout(function(){
            $('#matches-table').dataTable();
        }, 0);
    });
});