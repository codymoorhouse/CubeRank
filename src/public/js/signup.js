(function(angular) {
    'use strict';
    var app = angular.module('signup', []);

    app.controller('signupCtrl', ['$window', '$scope', '$http', function ($window, $scope, $http) {
        $scope.master = {};

        $scope.save= function (model) {
            if ($scope.addContact.$valid) {
                //form is valid
            }
            else {
                //if form is not valid set $scope.addUser.submitted to true
                $scope.addUser.submitted=true;
            }};

        $http.get("api/v1/users").then(function(response) {
            $scope.signup = response.data.data;
            $scope.isUsernameValid = false;
            $scope.usernames = [];

            for (var i = 0; i < response.data.data.length; i++) {
                $scope.usernames.push(response.data.data[i].username);
            }

        });

        $scope.create = function(user) {

            if (user === undefined ||
                user.fname === undefined ||
                user.lname === undefined ||
                user.email === undefined ||
                user.password === undefined ||
                user.username === undefined ||
                user.password !== user.passwordAgain ||
                !$scope.isUsernameValid) {
                return false;
            }

            $http.post("api/v1/users", user).then(function(response) {
                /* Redirect after user is created */
                $http.post("/login", $scope.user).then(function(response) {
                    $window.location.href = '/dashboard';
                });
            });
        };

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

    app.directive('passwordDir', function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=passwordDir"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.passwordDir = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    });

})(window.angular);