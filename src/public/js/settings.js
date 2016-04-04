
$(document).ready(function() {
    $("input[id='upload_icon']").click(function() {
        $("input[id='picture_upload']").click();
    });
});


(function(angular) {
    'use strict';
    var app = angular.module('settings', []);

    app.controller('settingsCtrl', ['$window', '$scope', '$http', function ($window, $scope, $http) {
        $scope.master = {};

        $scope.init = function (userId) {
            $scope.userId = userId;
        }

        $scope.save = function (model) {
            if ($scope.updateUser.$valid) {
                //form is valid
            }
            else {
                //if form is not valid set $scope.updateUser.submitted to true
                $scope.updateUser.submitted = true;
        }};

        $scope.update = function(user) {
            if (user === undefined ||
                user.fname === undefined ||
                user.lname === undefined ||
                user.email === undefined ||
                user.passwordCurrent === undefined ||
                user.passwordNew !== user.passwordAgain) {
                return false;
            }

            var updatedUser = {
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                oldpassword: user.passwordCurrent
            }

            if (user.passwordNew != undefined) {
                updatedUser['newpassword'] = user.passwordNew;
            }

            $http.put("api/v1/users/" + $scope.userId, updatedUser).then(function(response) {
                /* Redirect after user is created */
                $window.location.href = '/dashboard';
            }, function(response) {
                $scope.updateUser.passwordfail = true;
            });
        }

    }]);

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