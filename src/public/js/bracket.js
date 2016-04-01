(function() {
    var app = angular.module('tournament', []);
    var options = [2, 4, 8, 16, 32];




    app.controller('TournamentGenerator', ['$http', function($http, $scope){
    }]);

    app.controller('BracketController', ['$http','$location','$window', function($http, $location, $window){

        this.names = [];

        this.generate = function(title, participants){


            this.names = participants.split('\n');

            var data = {
                title: title,
                names: this.names
            };

            var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
            };


            $http.post('/api/v1/tournaments/', data, config).success(function(){
                $window.location.href = '/tournament';
            });
        }



    }]);

    //app.controller('GeneratorController', ['$http', '$location', '$scope', function($http, $location, $scope){
    //    $http.post('/api/v1/tournaments/', $scope).success(function(){
    //        $location.path('/tournament')
    //    });
    //}]);


})();


//this.size = 4;
//this.options = options;
//this.rows = 2*this.size - 2;
//this.columns = 2*(Math.log(this.size) / Math.log(2)) - 1;
//
//console.log(this.options);
//
//this.changeSize = function(newSize){
//    this.size = newSize;
//    this.rows = 2*newSize - 2;
//    this.columns = 2*(Math.log(newSize) / Math.log(2)) - 1;
//
//};


//$locationProvider.html5Mode(true);
//app.directive('tournament', function(){
//    return {
//        restrict: 'E',
//        templateUrl: "tournament.ejs",
//        controller: [$http, $log, function($http, $log){
//            this.tournament = {};
//            //$http.get()
//        }],
//        controllerAs: 'tournament'
//    };
//
//});
