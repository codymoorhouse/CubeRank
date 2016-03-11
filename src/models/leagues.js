// api/v1/leagues
exports.retrieveLeagues = function (db, req, res) {
    db.query(
        "SELECT title FROM CubeRank.leagues", function (err, leagues) {
            if (err) {
                res.json({
                    statusCode: 500,
                    message: "Failed to find leagues"
                });
            }
            res.json({
                statusCode: 200,
                data: leagues
            });
        });
};

// api/v1/leagues/:id
exports.retrieveLeagueId = function (db, req, res) {
    db.query(
        "SELECT title FROM CubeRank.leagues WHERE id = ?", [req.params.id], function (err, leagueInfo) {
            if (err) {
                res.json({
                    statusCode: 500,
                    message: "Failed to find leagues"
                });
            }

            else {
                if (leagueInfo.length === 0) {
                    res.json({
                        statusCode: 404,
                        data: "league not found"
                    });
                }

                else {
                    res.json({
                        statusCode: 200,
                        data: leagueInfo
                    });
                }
            }
        });
};
// this one just because I don't know what we want out of league
exports.retrieveLeagueDescriptionId = function (db, req, res) {
    db.query(
        "SELECT title, description FROM CubeRank.leagues WHERE id = ?", [req.params.id], function (err, leagueInfo) {
            if (err) {
                res.json({
                    statusCode: 500,
                    message: "Failed to find leagues"
                });
            }

            else {
                if (leagueInfo.length === 0) {
                    res.json({
                        statusCode: 404,
                        data: "league not found"
                    });
                }

                else {
                    res.json({
                        statusCode: 200,
                        data: leagueInfo
                    });
                }
            }
        });
};

// api/v1/leagues/:id/matches
exports.retrieveLeagueMatchId = function (db, req, res) {
    db.query(
        "SELECT * FROM CubeRank.matches where league_id = ?", [req.params.id], function (err, matchInfo) {
            if (err) {
                res.json({
                    statusCode: 500,
                    message: "Failed to find league"
                });
            }

            else {
                if (matchInfo.length === 0) {
                    res.json({
                        statusCode: 404,
                        data: "league not found"
                    });
                }

                else {
                    res.json({
                        statusCode: 200,
                        data: matchInfo
                    });
                }
            }
        });
};

// /api/v1/leagues/:id/tournaments
exports.retrieveLeagueTournamentId = function (db, req, res) {
    db.query(
        "SELECT * FROM CubeRank.tournaments where league_id = ?", [req.params.id], function (err, tournamentInfo) {
            if (err) {
                res.json({
                    statusCode: 500,
                    message: "Failed to find league"
                });
            }

            else {
                if (tournamentInfo.length === 0) {
                    res.json({
                        statusCode: 404,
                        data: "league not found"
                    });
                }

                else {
                    res.json({
                        statusCode: 200,
                        data: tournamentInfo
                    });
                }
            }
        });
};

// /api/v1/leagues/:id/users
exports.retrieveLeagueUserId = function (db, req, res) {
    db.query(
        "SELECT DISTINCT username, id FROM CubeRank.league_user, CubeRank.users WHERE league_id = ? AND user_id = id;", [req.params.id], function (err, userInfo) {
            if (err) {
                res.json({
                    statusCode: 500,
                    message: "Failed to find league"
                });
            }

            else {
                if (userInfo.length === 0) {
                    res.json({
                        statusCode: 404,
                        data: "league not found"
                    });
                }

                else {
                    res.json({
                        statusCode: 200,
                        data: userInfo
                    });
                }
            }
        });
};

// api/v1/leagues/:id/userRanks?min=0&max=5000 // The highest by a chess player was 2882
// im going to make this better later just wanted it working
exports.retrieveUserRanks = function (db, req, res) {

    var queryStr = "";

    if (req.query.hasOwnProperty('min') && req.query.hasOwnProperty('max')) {
        queryStr = "SELECT DISTINCT username, user_rank FROM CubeRank.league_user, CubeRank.users WHERE user_rank > ? AND user_rank < ? AND user_id = id AND league_id = ? ORDER BY user_rank DESC;";
        db.query(
            queryStr, [req.query.min, req.query.max, req.params.id], function(err, userMatches) {
                if (err)  {
                    res.status(500);
                    res.json({
                        statusCode: 500,
                        message: "Failed to find user matches"
                    });
                }

                else {
                    if (userMatches.length === 0) {
                        res.status(404);
                        res.json({
                            statusCode: 404,
                            data: "User not found in any matches"
                        });
                    }

                    else {
                        res.status(200);
                        res.json({
                            statusCode: 200,
                            data: userMatches
                        });
                    }
                }
            });
    }

    if (req.query.hasOwnProperty('min') && !req.query.hasOwnProperty('max')) {
        queryStr = "SELECT DISTINCT username, user_rank FROM CubeRank.league_user, CubeRank.users WHERE user_rank > ? AND user_rank < 5000 AND user_id = id AND league_id = ? ORDER BY user_rank DESC;";
        db.query(
            queryStr, [req.query.min, req.params.id], function(err, userMatches) {
                if (err)  {
                    res.status(500);
                    res.json({
                        statusCode: 500,
                        message: "Failed to find user matches"
                    });
                }

                else {
                    if (userMatches.length === 0) {
                        res.status(404);
                        res.json({
                            statusCode: 404,
                            data: "User not found in any matches"
                        });
                    }

                    else {
                        res.status(200);
                        res.json({
                            statusCode: 200,
                            data: userMatches
                        });
                    }
                }
            });
    }

    if (req.query.hasOwnProperty('max') && !req.query.hasOwnProperty('min')) {
        queryStr = "SELECT DISTINCT username, user_rank FROM CubeRank.league_user, CubeRank.users WHERE user_rank > 0 AND user_rank < ? AND user_id = id AND league_id = ? ORDER BY user_rank DESC;";
        db.query(
            queryStr, [req.query.max, req.params.id], function(err, userMatches) {
                if (err)  {
                    res.status(500);
                    res.json({
                        statusCode: 500,
                        message: "Failed to find user matches"
                    });
                }

                else {
                    if (userMatches.length === 0) {
                        res.status(404);
                        res.json({
                            statusCode: 404,
                            data: "User not found in any matches"
                        });
                    }

                    else {
                        res.status(200);
                        res.json({
                            statusCode: 200,
                            data: userMatches
                        });
                    }
                }
            });
    }

    if (!req.query.hasOwnProperty('max') && !req.query.hasOwnProperty('min')) {
        queryStr = "SELECT DISTINCT username, user_rank FROM CubeRank.league_user, CubeRank.users WHERE user_rank > 0 AND user_rank < 5000 AND user_id = id AND league_id = ? ORDER BY user_rank DESC;";
        db.query(
            queryStr, [req.params.id], function(err, userMatches) {
                if (err)  {
                    res.status(500);
                    res.json({
                        statusCode: 500,
                        message: "Failed to find user matches"
                    });
                }

                else {
                    if (userMatches.length === 0) {
                        res.status(404);
                        res.json({
                            statusCode: 404,
                            data: "User not found in any matches"
                        });
                    }

                    else {
                        res.status(200);
                        res.json({
                            statusCode: 200,
                            data: userMatches
                        });
                    }
                }
            });
    }

};



