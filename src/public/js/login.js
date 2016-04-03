(function(angular) {
    'use strict';
    var app = angular.module('login', []);

    app.controller('loginCtrl', ['$window', '$scope', '$http', function ($window, $scope, $http) {
        $scope.master = {};

        $scope.save= function (model) {
            if ($scope.addContact.$valid) {
                //form is valid
            }
            else {
                //if form is not valid set $scope.loginUser.submitted to true
                $scope.loginUser.submitted=true;
            }};

        $http.get("api/v1/users").then(function(response) {
            $scope.login = response.data.data;
            $scope.isUsernameValid = false;
            $scope.usernames = [];

            for (var i = 0; i < response.data.data.length; i++) {
                $scope.usernames.push(response.data.data[i].username);
            }

            $scope.create = function(user) {

                if (user === undefined ||
                    user.username === undefined ||
                    user.password === undefined ||
                    !$scope.isUsernameValid) {
                    return false;
                };

                user.password = bcrypt(user.password);

                $http.post("api/v1/users", user).then(function(response) {
                    /* Redirect after user is created */
                    $window.location.href = '/';
                });
            }
        });

        $scope.create = function (user) {
            $scope.master = angular.copy(user);
        };
    }]);

    app.directive('usernameDir', function ($q, $timeout) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$asyncValidators.usernameAuth = function (modelValue, viewValue) {

                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty model valid
                        return $q.when();
                    }

                    var def = $q.defer();

                    $timeout(function () {
                        // Mock a delayed response
                        if (scope.usernames.indexOf(modelValue) === -1) {
                            // The username is available
                            def.resolve();
                            scope.isUsernameValid = true;
                        } else {
                            def.reject();
                            scope.isUsernameValid = false;
                        }

                    }, 700);

                    return def.promise;
                };
            }
        };
    });

})(window.angular);
