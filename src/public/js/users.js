(function(angular) {
    'use strict';
    var app = angular.module('usersApp', []);

    app.controller('usersCtrl', ['$window', '$timeout', '$scope', '$http', function ($window, $timeout, $scope, $http) {
        $scope.master = {};
        $scope.userList = [];

        $http.get("api/v1/users").then(function (response) {
            for (var i = 0; i < response.data.data.length; i++) {
                $scope.adduser = {
                    id: response.data.data[i]['id'],
                    fname: response.data.data[i]['name'].split(' ')[0],
                    lname: response.data.data[i]['name'].split(' ')[1],
                    username: response.data.data[i]['username']
                }


                $scope.userList.push($scope.adduser);

            }
        }, function (response) {
            $scope.matchList.push();
        }).then(function() {
            $timeout(function() {
                $('#users_table').dataTable();
            }, 0);
        });
    }]);
})(window.angular);
