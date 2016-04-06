angular.module('create_match', [])
    .controller('CreateMatchController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
        $scope.create = function (match) {
            $http.post("/api/v1/tournaments/1/matches/", match).then(function (response) {
                $scope.response = response.status;
                if (response.status == 200)
                    $window.location.href = "/matches";
                else
                    $window.alert(response.message);
            });
        }
    }]);