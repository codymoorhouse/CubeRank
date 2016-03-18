// Manage Users table

// api/v1/users
exports.createUser = function(db, req, res) {
    if (req.body.fname !== undefined &&
        req.body.fname !== null &&
        req.body.lname !== undefined &&
        req.body.lname !== null &&
        req.body.email !== undefined &&
        req.body.email !== null &&
        req.body.username !== undefined &&
        req.body.username !== null &&
        req.body.password !== undefined &&
        req.body.password !== null)
    {
        db.query(
            "INSERT INTO users (fname, lname, email, username, password) VALUES (?, ?, ?, ?, ?)",
            [
                req.body.fname,
                req.body.lname,
                req.body.email,
                req.body.username,
                req.body.password
            ], function (err) {
                if (err) {
                    db.query(
                        "SELECT LAST_INSERT_ID()", function (err, id) {
                            if (id[0]['LAST_INSERT_ID()'] === 0) {
                                res.status(409);
                                res.json({
                                    statusCode: 409,
                                    message: "User already exists"
                                });
                            }

                            else {
                                res.status(500);
                                res.json({
                                    statusCode: 500,
                                    message: "Failed to create new user"
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

        if (req.body.fname === undefined || req.body.fname === null) { fields.push("fname"); }
        if (req.body.lname === undefined || req.body.lname === null) { fields.push("lname"); }
        if (req.body.email === undefined || req.body.email === null) { fields.push("email"); }
        if (req.body.username === undefined || req.body.username === null) { fields.push("username"); }
        if (req.body.password === undefined || req.body.password === null) { fields.push("password"); }

        console.log(fields.join(','));
        res.status(412);
        res.json({
            statusCode: 412,
            message: response + fields.join(', ')
        });
    }
};

// api/v1/users
exports.retrieveUsers = function(db, req, res) {
    var selectClause = "SELECT u.id AS id, CONCAT(u.fname, ' ', u.lname) AS name ";
    var fromClause = "FROM users AS u";
    var whereClause = "";

    db.query(
        selectClause + fromClause + whereClause, function(err, users) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find users"
                });
            }

            else {
                res.status(200);
                res.json({
                    statusCode: 200,
                    data: users
                });
            }
        });
};

// api/v1/users/:id
exports.retrieveUser = function(db, req, res) {
    var selectClause = "SELECT u.id AS id, CONCAT(u.fname, ' ', u.lname) AS name ";
    var fromClause = "FROM users AS u ";
    var whereClause = "WHERE id = ?";

    db.query(
        selectClause + fromClause + whereClause, [req.params.id], function(err, userInfo) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find users"
                });
            }

            else {
                if (userInfo.length === 0) {
                    res.status(404);
                    res.json({
                        statusCode: 404,
                        data: "User not found"
                    });
                }

                else {
                    res.status(200);
                    res.json({
                        statusCode: 200,
                        data: userInfo
                    });
                }
            }
        });
};

// api/v1/users/:id
exports.updateUser = function(db, req, res) {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE id = ?", [req.params.id], function(err, data) {
            if (err) {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to retrieve user record"
                });
            }

            if (data.length === 0) {
                res.status(404);
                res.json({
                    statusCode: 404,
                    data: "User not found"
                });
            }

            else {
                if (req.body.fname === undefined || req.body.fname === null)  fname = data[0]['fName'];
                if (req.body.lname === undefined || req.body.lname === null) lname = data[0]['lName'];
                if (req.body.email === undefined || req.body.email === null) email = data[0]['email'];
                if (req.body.password === undefined || req.body.password === null) password = data[0]['password'];

                db.query(
                    "UPDATE users SET fName = ?, lName = ?, email = ?, password = ? WHERE id = ?", [
                        fname,
                        lname,
                        email,
                        password,
                        req.params.id],

                    function(err) {
                        if (err)  {
                            res.status(500);
                            res.json({
                                statusCode: 500,
                                message: "Failed to update user record"
                            });
                        }

                        else {
                            res.status(200);
                            res.json({
                                statusCode: 200,
                                message: "User updated"
                            });
                        }
                    });
            }
    });


};

// api/v1/users/:id
exports.deleteUser = function(db, req, res) {
    db.query(
        "SELECT * FROM users WHERE id = ?", [req.params.id], function (err, userInfo) {
            if (err) {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find users"
                });
            }

            else {
                if (userInfo.length === 0) {
                    res.status(404);
                    res.json({
                        statusCode: 404,
                        data: "User not found"
                    });
                }

                else {
                    db.query(
                        "DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
                            if (err) {
                                res.status(500);
                                res.json({
                                    statusCode: 500,
                                    message: "Failed to delete user"
                                });
                            }
                            else {
                                res.status(200);
                                res.json({
                                    statusCode: 200,
                                    message: "User was deleted"
                                });
                            }
                        });
                }
            }
        });
}

// api/v1/users/:id/leagues
exports.retrieveUserLeagues = function(db, req, res) {
    var selectClause = "SELECT u.id AS user_id, CONCAT(u.fname, ' ', u.lname) AS user_name, o.id AS org_id, o.oname AS org_name, o.description AS org_description, l.id AS league_id, l.title AS league_name, l.description AS league_description, lu.user_rank AS ranking ";
    var fromClause = "FROM league_user as lu INNER JOIN users AS u ON lu.user_id = u.id INNER JOIN leagues AS l ON lu.league_id = l.id INNER JOIN organizations AS o ON l.organization_id = o.id ";
    var whereClause = "WHERE user_id = ?";

    db.query(
        selectClause + fromClause + whereClause, [req.params.id], function(err, userLeagues) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find user leagues"
                });
            }

            else {
                if (userLeagues.length === 0) {
                    res.status(404);
                    res.json({
                        statusCode: 404,
                        data: "User not found in any leagues"
                    });
                }

                else {
                    res.status(200);
                    res.json({
                        statusCode: 200,
                        data: userLeagues
                    });
                }
            }
        });
};


// api/v1/users/:id/matches
// api/v1/users/:id/matches?recent
exports.retrieveUserMatches = function(db, req, res) {
    var error404 = "User not found in any matches";
    var selectClause = "SELECT l.id AS league_id, l.title AS league_name, l.description AS league_description, m.tournament_id AS tournament_id,  u1.id AS player1_id, CONCAT(u1.fname, ' ', u1.lname) AS player1_name, u2.id AS player2_id, CONCAT(u2.fname, ' ', u2.lname) AS player2_name, m.id AS match_id, DATE_FORMAT(m.match_date, '%M %d, %Y') AS match_date, DATE_FORMAT(m.match_date, '%H:%i HRS') AS match_time, CASE match_result WHEN 0 THEN 'draw' WHEN 1 THEN CONCAT(u1.fname, ' ', u1.lname) WHEN 2 THEN CONCAT(u2.fname, ' ', u2.lname) ELSE 'incomplete' END AS match_winner ";
    var fromClause = "FROM matches AS m INNER JOIN users AS u1 ON m.user1_id = u1.id INNER JOIN users AS u2 ON m.user2_id = u2.id INNER JOIN leagues AS l ON m.league_id = l.id ";
    var whereClause = "WHERE user1_id = ? or user2_id = ?";

    if (req.query.hasOwnProperty('recent') && req.query['recent'] !== '0') {
        error404 = "User not found in any recent matches"
        whereClause = "WHERE (user1_id = ? OR user2_id = ?) AND (DATEDIFF(CURDATE(), DATE(m.match_date)) BETWEEN 0 AND " + req.query['recent'] + ")";
    }

    db.query(
        selectClause + fromClause + whereClause, [req.params.id, req.params.id], function(err, userMatches) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find users matches"
                });
            }

            else {
                if (userMatches.length === 0) {
                    res.status(404);

                    res.json({
                        statusCode: 404,
                        data: error404
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
};

// api/v1/users/:id/orgs
exports.retrieveUserOrgs = function(db, req, res) {
    var selectClause = "SELECT u.id AS user_id, CONCAT(u.fname, ' ', u.lname) AS user_name, o.id AS org_id, o.oname AS org_name, o.description AS org_description ";
    var fromClause = "FROM organization_user as ou INNER JOIN users AS u ON ou.user_id = u.id INNER JOIN organizations AS o ON ou.organization_id = o.id ";
    var whereClause = "WHERE user_id = ?";

    db.query(
        selectClause + fromClause + whereClause, [req.params.id], function(err, userOrgs) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find user organizations"
                });
            }

            else {
                if (userOrgs.length === 0) {
                    res.status(404);
                    res.json({
                        statusCode: 404,
                        data: "User not found in any organizations"
                    });
                }

                else {
                    res.status(200);
                    res.json({
                        statusCode: 200,
                        data: userOrgs
                    });
                }
            }
        });
};

// api/v1/users/:id/teams
exports.retrieveUserTeams = function(db, req, res) {
    var selectClause = "SELECT * from ";
    var fromClause = "FROM team_user as tu ";
    var whereClause = "WHERE user_id = ?"

    db.query(
        selectClause + fromClause + whereClause, [req.params.id], function(err, userTeams) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find user teams"
                });
            }

            else {
                if (userTeams.length === 0) {
                    res.status(404);
                    res.json({
                        statusCode: 404,
                        data: "User not found in any teams"
                    });
                }

                else {
                    res.status(200);
                    res.json({
                        statusCode: 200,
                        data: userTeams
                    });
                }
            }
        });
};

// api/v1/users/:id/tournaments
exports.retrieveUserTournaments = function(db, req, res) {
    var selectClause = "SELECT u.id AS user_id, CONCAT(u.fname, ' ', u.lname) AS user_name, o.id AS org_id, o.oname AS org_name, o.description AS org_description, l.id AS league_id, l.title AS league_name, l.description AS league_description, t.id AS tournament_id, t.title AS tournament_name, tu.user_rank AS ranking ";
    var fromClause = "FROM tournament_user as tu INNER JOIN users AS u ON tu.user_id = u.id INNER JOIN tournaments AS t ON tu.tournament_id = t.id INNER JOIN leagues AS l ON t.league_id = l.id INNER JOIN organizations AS o ON l.organization_id = o.id ";
    var whereClause = "WHERE user_id = ?";

    db.query(
        selectClause + fromClause + whereClause, [req.params.id], function(err, userTournaments) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find user tournaments"
                });
            }

            else {
                if (userTournaments.length === 0) {
                    res.status(404);
                    res.json({
                        statusCode: 404,
                        data: "User not found in any tournaments"
                    });
                }

                else {
                    res.status(200);
                    res.json({
                        statusCode: 200,
                        data: userTournaments
                    });
                }
            }
        });
};
