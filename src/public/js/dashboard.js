(function(angular) {
    'use strict';
    var app = angular.module('dashboardApp', []);

    app.controller('dashboardCtrl', ['$window', '$timeout', '$scope', '$http', function ($window, $timeout, $scope, $http) {
        $scope.master = {};
        $scope.matchList = [];

        $scope.init = function (userId) {
            $scope.userId = userId;

            $http.get("api/v1/users/" + userId + "/matches?recent=30").then(function (response) {
                for (var i = 0; i < response.data.data.length; i++) {
                    $scope.newMatch = {
                        league: response.data.data[i]['league_description'],
                        matchdate: response.data.data[i]['match_date'],
                        matchtime: response.data.data[i]['match_time'],
                        winner: response.data.data[i]['match_winner']
                    }

                    if (response.data.data[i]['player1_id'] == userId) {
                        $scope.newMatch['opponent'] = response.data.data[i]['player2_name'];
                    } else {
                        $scope.newMatch['opponent'] = response.data.data[i]['player1_name'];
                    }

                    $scope.matchList.push($scope.newMatch);
                
		}
		}).then(function() {
		    $timeout(function() {
			$('#recent_table').dataTable();
		    }, 0);
	    });
	};
    }]);
})(window.angular);
