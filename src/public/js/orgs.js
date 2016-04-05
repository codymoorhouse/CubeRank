var app = angular.module('orgs', []);
app.controller('MainController', function($scope, $http, $timeout, $window) {
    $http.get("/api/v1/orgs").then(function(response) {
        $scope.orgs = response.data.data;
        $scope.heading = 'Organizations';
        $timeout(function(){
            $('#orgs-table').dataTable();
        }, 0);
    });
});