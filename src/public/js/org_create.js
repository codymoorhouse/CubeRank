angular.module('create_org', [])
    .controller('CreateOrgController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
        $scope.create = function (org) {
            $http.post("/api/v1/orgs", org).then(function (response) {
                $scope.response = response.status;
                if (response.status == 200)
                    $window.location.href = "/orgs";
                else
                    $window.alert(response.message);
            });
        }
    }]);