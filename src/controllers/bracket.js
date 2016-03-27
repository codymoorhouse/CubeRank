(function() {
    var app = angular.module('tournament', []);

    app.directive('tournament', function(){
        return {
            restrict: 'E',
            templateUrl: "tournament.handlebars",
            controller: function(){
                this.tournament = {};
            },
            controllerAs: 'tournament'
        };

    });

    

})();
