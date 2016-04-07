
    var app = angular.module('profile', ['ngRoute']);

    app.controller('TabsController', function() {
        this.tab = 1;

        this.setTab = function(tab) {
            this.tab = tab;
        };

        this.isSet = function(tab) {
            return this.tab === tab;
        }
    });

    app.config(function($routeProvider, $locationProvider) {
        $routeProvider.when('/users/:id', {
            controller: 'ProfileController'
        });

        $locationProvider.html5Mode({enabled: true, requireBase: false});
    });

    app.controller('ProfileController', function ($scope, $routeParams, $http, $timeout) {
            $scope.$on('$routeChangeSuccess', function() {
                console.log($routeParams);
                $scope.master = {};
                $scope.matchList = [];
                $scope.orgList = [];
                $scope.leagueList = [];
                $scope.tournamentList = [];

                var userId = $routeParams.id;


                $http.get("/api/v1/users/" + userId).then(function (response) {
                    $scope.user = response.data.data[0];
                });

                $http.get("/api/v1/users/" + userId + "/matches?recent=30").then(function (response) {
                    for (var i = 0; i < response.data.data.length; i++) {
                        $scope.newMatch = {
                            league_id: response.data.data[i]['league_id'],
                            league: response.data.data[i]['league_description'],
                            matchdate: response.data.data[i]['match_date'],
                            matchtime: response.data.data[i]['match_time'],
                            winner: response.data.data[i]['match_winner']
                        }

                        if (response.data.data[i]['player1_id'] == userId) {
                            $scope.newMatch['opponent'] = response.data.data[i]['player2_name'];
                        } else {
                            $scope.newMatch['opponent'] = response.data.data[i]['player1_name'];
                        }
                        $scope.matchList.push($scope.newMatch);
                    }
                }, function (response) {
                    $scope.matchList.push();
                }).then(function () {
                    $timeout(function () {
                        $('#recent_table').dataTable();
                    }, 0);
                });

                $http.get("/api/v1/users/" + userId + "/orgs").then(function (response) {
                    for (var i = 0; i < response.data.data.length; i++) {
                        $scope.newOrg = {
                            org_id: response.data.data[i]['org_id'],
                            org_name: response.data.data[i]['org_name'],
                            org_description: response.data.data[i]['org_description']
                        }

                        $scope.orgList.push($scope.newOrg);
                    }
                }, function (response) {
                    $scope.orgList.push();
                }).then(function () {
                    $timeout(function () {
                        $('#org_table').dataTable();
                    }, 0);
                });

                $http.get("/api/v1/users/" + userId + "/leagues").then(function (response) {
                    for (var i = 0; i < response.data.data.length; i++) {
                        $scope.newLeague = {
                            org_id: response.data.data[i]['org_id'],
                            org_name: response.data.data[i]['org_name'],
                            league_id: response.data.data[i]['league_id'],
                            league_name: response.data.data[i]['league_name'],
                            league_description: response.data.data[i]['league_description'],
                            ranking: response.data.data[i]['ranking']
                        }

                        $scope.leagueList.push($scope.newLeague);
                    }
                }, function (response) {
                    $scope.leagueList.push();
                }).then(function () {
                    $timeout(function () {
                        $('#league_table').dataTable();
                    }, 0);
                });

                $http.get("/api/v1/users/" + userId + "/tournaments").then(function (response) {
                    for (var i = 0; i < response.data.data.length; i++) {
                        $scope.newTournament = {
                            org_id: response.data.data[i]['org_id'],
                            org_name: response.data.data[i]['org_name'],
                            league_id: response.data.data[i]['league_id'],
                            league_name: response.data.data[i]['league_name'],
                            tournament_id: response.data.data[i]['tournament_description'],
                            tournament_name: response.data.data[i]['tournament_name'],
                            ranking: response.data.data[i]['ranking']
                        }

                        $scope.tournamentList.push($scope.newTournament);
                    }
                }, function (response) {
                    $scope.tournamentList.push();
                }).then(function () {
                    $timeout(function () {
                        $('#tournament_table').dataTable();
                    }, 0);
                });
            });
        });