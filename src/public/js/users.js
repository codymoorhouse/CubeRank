(function(angular) {
    'use strict';
    var app = angular.module('usersApp', []);

    app.controller('usersCtrl', ['$window', '$timeout', '$scope', '$http', function ($window, $timeout, $scope, $http) {
        $scope.master = {};
        $scope.userList = [];

        $http.get("api/v1/users").then(function (response) {
            for (var i = 0; i < response.data.data.length; i++) {
                $scope.userList.push(response.data.data[i]);
            }
        });

        $scope.startDatatable = function() {
            $timeout(function(){
                $('#users_table').dataTable();
            }, 0);
        };
    }]);
})(window.angular);
