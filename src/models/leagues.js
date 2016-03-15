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

// /api/v1/leagues/description/:id
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
                    message: "Failed to find league user"
                });
            }

            else {
                if (userInfo.length === 0) {
                    res.json({
                        statusCode: 404,
                        data: "league user not found"
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
            queryStr, [req.query.min, req.query.max, req.params.id], function (err, userRanks) {
                errMessage(err, userRanks);
            });
    }

    if (req.query.hasOwnProperty('min') && !req.query.hasOwnProperty('max')) {
        queryStr = "SELECT DISTINCT username, user_rank FROM CubeRank.league_user, CubeRank.users WHERE user_rank > ? AND user_rank < 5000 AND user_id = id AND league_id = ? ORDER BY user_rank DESC;";
        db.query(
            queryStr, [req.query.min, req.params.id], function (err, userRanks) {
                errMessage(err, userRanks);
            });
    }

    if (req.query.hasOwnProperty('max') && !req.query.hasOwnProperty('min')) {
        queryStr = "SELECT DISTINCT username, user_rank FROM CubeRank.league_user, CubeRank.users WHERE user_rank > 0 AND user_rank < ? AND user_id = id AND league_id = ? ORDER BY user_rank DESC;";
        db.query(
            queryStr, [req.query.max, req.params.id], function (err, userRanks) {
                errMessage(err, userRanks);
            });
    }

    if (!req.query.hasOwnProperty('max') && !req.query.hasOwnProperty('min')) {
        queryStr = "SELECT DISTINCT username, user_rank FROM CubeRank.league_user, CubeRank.users WHERE user_rank > 0 AND user_rank < 5000 AND user_id = id AND league_id = ? ORDER BY user_rank DESC;";
        db.query(
            queryStr, [req.params.id], function (err, userRanks) {
                errMessage(err, userRanks);
            });
    }

    function errMessage(err, userRanks){
        if (err) {
            res.status(500);
            res.json({
                statusCode: 500,
                message: "Failed to find user ranks"
            });
        }

        else {
            if (userRanks.length === 0) {
                res.status(404);
                res.json({
                    statusCode: 404,
                    data: "User rank not found"
                });
            }

            else {
                res.status(200);
                res.json({
                    statusCode: 200,
                    data: userRanks
                });
            }
        }
    }

};

// api/v1/Leagues/:id
exports.updateLeague = function (db, req, res) {
    var title = req.body.title;
    var description = req.body.description;

    db.query(
        "SELECT * FROM CubeRank.leagues WHERE id = ?", [req.params.id], function (err, data) {
            if (err) {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to retrieve league record"
                });
            }

            if (data.length === 0) {
                res.status(404);
                res.json({
                    statusCode: 404,
                    data: "league not found"
                });
            }

            else {
                if (req.body.title === undefined || req.body.fname === null)  title = data[0]['title'];
                if (req.body.description === undefined || req.body.lname === null) description = data[0]['description'];

                db.query(
                    "UPDATE CubeRank.leagues SET title = ?, description = ? WHERE id = ?", [
                        title,
                        description,
                        req.params.id],

                    function (err) {
                        if (err) {
                            res.status(500);
                            res.json({
                                statusCode: 500,
                                message: "Failed to update league record"
                            });
                        }

                        else {
                            res.status(200);
                            res.json({
                                statusCode: 200,
                                message: "League updated"
                            });
                        }
                    });
            }
        });


};

// api/v1/league/:id
exports.deleteLeague = function (db, req, res) {
    db.query(
        "DELETE FROM CubeRank.leagues WHERE id = ?", [req.params.id], function (err) {
            if (err) {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to delete league"
                });
            }
            else {
                res.status(200);
                res.json({
                    statusCode: 200,
                    message: "league was deleted"
                });
            }
        });
};

// / api/v1/leagues/:id/matches
exports.createMatch = function (db, req, res) {
    if (req.body.match_date !== undefined &&
        req.body.match_date !== null &&
        req.body.user1_id !== undefined &&
        req.body.user1_id !== null &&
        req.body.user2_id !== undefined &&
        req.body.user2_id !== null) {
        db.query(
            "INSERT INTO CubeRank.matches(match_date, match_result, league_id, tournament_id, user1_id, user2_id) VALUES (?, ?, "+req.params.id+", ?, ?, ?)",
            [
                req.body.match_date,
                req.body.match_result,
                req.body.tournament_id,
                req.body.user1_id,
                req.body.user2_id
            ], function (err) {
                if (err) {
                    db.query(
                        "SELECT LAST_INSERT_ID()", function (err, id) {
                            if (id[0]['LAST_INSERT_ID()'] === 0) {
                                res.status(409);
                                res.json({
                                    statusCode: 409,
                                    message: "Match already exists :" + err
                                });
                            }

                            else {
                                res.status(500);
                                res.json({
                                    statusCode: 500,
                                    message: "Failed to create new match"
                                });
                            }
                        });
                }

                else {
                    res.status(200);
                    res.json({
                        statusCode: 200,
                        message: "New match added"
                    });
                }
            }
        );
    }

    else {
        var response = "Failed to create new match (fields not specified): ";
        var fields = [];

        if (req.body.match_date === undefined || req.body.match_date === null) {
            fields.push("match_date");
        }

        if (req.body.user1_id === undefined || req.body.user1_id === null) {
            fields.push("user1_id");
        }
        if (req.body.user2_id === undefined || req.body.user2_id === null) {
            fields.push("user2_id");
        }

        console.log(fields.join(','));
        res.status(412);
        res.json({
            statusCode: 412,
            message: response + fields.join(', ')
        });
    }
};

// api/v1/leagues/:id/tournaments
exports.createTournament = function (db, req, res) {

    if (req.body.title !== undefined &&
        req.body.title !== null) {
        db.query(
            "INSERT INTO CubeRank.tournaments (league_id, title) VALUES ("+req.params.id+", ?)",
            [
                req.body.title
            ], function (err) {
                if (err) {
                    db.query(
                        "SELECT LAST_INSERT_ID()", function (err, id) {
                            if (id[0]['LAST_INSERT_ID()'] === 0) {
                                res.status(409);
                                res.json({
                                    statusCode: 409,
                                    message: "Tournament already exists"
                                });
                            }

                            else {
                                res.status(500);
                                res.json({
                                    statusCode: 500,
                                    message: "Failed to create new tournament"
                                });
                            }
                        });
                }

                else {
                    res.status(200);
                    res.json({
                        statusCode: 200,
                        message: "New tournament added"
                    });
                }
            }
        );
    }

    else {
        var response = "Failed to create new tournament (fields not specified): ";
        var fields = [];

        if (req.body.title === undefined || req.body.title === null) {
            fields.push("title");
        }
        if (req.body.league_id === undefined || req.body.title === null) {
            fields.push(req.params.id);
        }

        console.log(fields.join(','));
        res.status(412);
        res.json({
            statusCode: 412,
            message: response + fields.join(', ')
        });
    }
};

// api/v1/leagues/:id/users
exports.createUserLeague = function (db, req, res) {
    if (req.body.user_rank !== undefined &&
        req.body.user_rank !== null &&
        req.body.user_role !== undefined &&
        req.body.user_role !== null &&
        req.body.user_id !== undefined &&
        req.body.user_id !== null) {
        db.query(
            "INSERT INTO CubeRank.league_user (user_rank, user_role, user_id, league_id) VALUES (?, ?, ?, "+req.params.id+")",
            [
                req.body.user_rank,
                req.body.user_role,
                req.body.user_id
            ], function (err) {
                if (err) {
                    db.query(
                        "SELECT LAST_INSERT_ID()", function (err, id) {
                            if (id[0]['LAST_INSERT_ID()'] === 0) {
                                res.status(409);
                                res.json({
                                    statusCode: 409,
                                    message: "User in league already exists"
                                });
                            }

                            else {
                                res.status(500);
                                res.json({
                                    statusCode: 500,
                                    message: "Failed to create new user in league"
                                });
                            }
                        });
                }

                else {
                    res.status(200);
                    res.json({
                        statusCode: 200,
                        message: "New user added"
                    });
                }
            }
        );
    }

    else {
        var response = "Failed to create new user (fields not specified): ";
        var fields = [];

        if (req.body.user_rank === undefined || req.body.user_rank === null) {
            fields.push("user_rank");
        }
        if (req.body.user_role === undefined || req.body.user_role === null) {
            fields.push("user_role");
        }
        if (req.body.user_id === undefined || req.body.user_id === null) {
            fields.push("user_id");
        }


        console.log(fields.join(','));
        res.status(412);
        res.json({
            statusCode: 412,
            message: response + fields.join(', ')
        });
    }
};

// api/v1/leagues/:id/user?user_id=79
exports.deleteLeagueUser = function (db, req, res) {
    var queryStr = "";

    if (req.query.hasOwnProperty('user_id')) {
        queryStr = "DELETE FROM CubeRank.league_user WHERE user_id = ? AND league_id = ?;";
        db.query(
            queryStr, [req.query.user_id, req.params.id], function (err) {
                if (err) {
                    res.status(500);
                    res.json({
                        statusCode: 500,
                        message: "Failed to delete league user"
                    });
                }
                else {
                    res.status(200);
                    res.json({
                        statusCode: 200,
                        message: "league user was deleted"
                    });
                }
            });
    }
};
