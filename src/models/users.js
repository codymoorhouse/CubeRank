// Manage Users table

// api/v1/users
exports.createUser = function(db, req, res) {
    db.query(
        "INSERT IGNORE INTO users (fname, lname, email, username, password) VALUES (?, ?, ?, ?, ?)",
        [
            req.body.fname,
            req.body.lname,
            req.body.email,
            req.body.username,
            req.body.password
        ], function(err) {
            if (err)  {
                res.json({
                    statusCode: 500,
                    message: "Failed to create new user"
                });
            }

            db.query(
                "SELECT LAST_INSERT_ID()", function(err, id) {
                    if (err) {
                        res.json({
                            statusCode: 500,
                            message: "Failed to create new user"
                        });
                    }

                    if (id[0]['LAST_INSERT_ID()'] === 0) {
                        res.json({
                            statusCode: 409,
                            message: "User already exists"
                        });
                    }

                    else {
                        res.json({
                            statusCode: 200,
                            message: "New user added"
                        });
                    }
                });
            });
};

// api/v1/users
exports.retrieveUsers = function(db, req, res) {
    db.query(
        "SELECT u.id AS id, CONCAT(u.fname, ' ', u.lname) AS name FROM users AS u", function(err, users) {
            if (err)  {
                res.json({
                    statusCode: 500,
                    message: "Failed to find users"
                });
            }
            res.json({
                statusCode: 200,
                data: users
            });
        });
};

// api/v1/users/:id
exports.retrieveUser = function(db, req, res) {
    db.query(
        "SELECT u.id AS id, CONCAT(u.fname, ' ', u.lname) AS name FROM users AS u WHERE id = ?", [req.params.id], function(err, userInfo) {
            if (err)  {
                res.json({
                    statusCode: 500,
                    message: "Failed to find users"
                });
            }

            if (userInfo.length === 0) {
                res.json({
                    statusCode: 404,
                    data: "User not found"
                });
            }

            else {
                res.json({
                    statusCode: 200,
                    data: userInfo
                });
            }
        });
};

// api/v1/users/:id
exports.updateUser = function(db, req, res) {
    db.query(
        "UPDATE users SET fname = ?, lname = ?, email = ?, password = ? WHERE id = ?", [
            req.body.fName,
            req.body.lName,
            req.body.email,
            req.body.password,
            req.params.id],

        function(err) {
            if (err)  {
                res.json({
                    statusCode: 500,
                    message: "Failed to update user record"
                });
            }
            res.json({
                statusCode: 200,
                message: "User updated"
            });
        });
};

// api/v1/users/:id
exports.deleteUser = function(db, req, res) {
    db.query(
        "DELETE FROM users WHERE id = ?", [req.params.id], function(err) {
            if (err)  {
                res.json({
                    statusCode: 500,
                    message: "Failed to delete user"
                });
            }
            res.json({
                statusCode: 200,
                message: "User was deleted"
            });
        });
};

// api/v1/users/:id/leagues
exports.retrieveUserLeagues = function(db, req, res) {
    db.query(
        "SELECT u.id AS user_id, CONCAT(u.fname, ' ', u.lname) AS user_name, o.id AS org_id, o.oname AS org_name, o.description AS org_description, l.id AS league_id, l.title AS league_name, l.description AS league_description, lu.user_rank AS ranking FROM league_user as lu INNER JOIN users AS u ON lu.user_id = u.id INNER JOIN leagues AS l ON lu.league_id = l.id INNER JOIN organizations AS o ON l.organization_id = o.id WHERE user_id = ?", [req.params.id], function(err, userLeagues) {
            if (err)  {
                res.json({
                    statusCode: 500,
                    message: "Failed to find user leagues"
                });
            }

            if (userLeagues.length === 0) {
                res.json({
                    statusCode: 404,
                    data: "User not found in any leagues"
                });
            }

            else {
                res.json({
                    statusCode: 200,
                    data: userLeagues
                });
            }
        });
};


// api/v1/users/:id/matches
exports.retrieveUserMatches = function(db, req, res) {
    db.query(
        "SELECT l.id AS league_id, l.title AS league_name, l.description AS league_description, m.tournament_id AS tournament_id,  u1.id AS player1_id, CONCAT(u1.fname, ' ', u1.lname) AS player1_name, u2.id AS player2_id, CONCAT(u2.fname, ' ', u2.lname) AS player2_name, m.id AS match_id, DATE_FORMAT(m.match_date, '%M %d, %Y') AS match_date, DATE_FORMAT(m.match_date, '%H:%i HRS') AS match_time, CASE match_result WHEN 0 THEN 'draw' WHEN 1 THEN CONCAT(u1.fname, ' ', u1.lname) WHEN 2 THEN CONCAT(u2.fname, ' ', u2.lname) ELSE 'incomplete' END AS match_winner FROM matches AS m INNER JOIN users AS u1 ON m.user1_id = u1.id INNER JOIN users AS u2 ON m.user2_id = u2.id INNER JOIN leagues AS l ON m.league_id = l.id WHERE user1_id = ? or user2_id = ?", [req.params.id, req.params.id], function(err, userMatches) {
            if (err)  {
                res.json({
                    statusCode: 500,
                    message: "Failed to find user matches"
                });
            }

            if (userMatches.length === 0) {
                res.json({
                    statusCode: 404,
                    data: "User not found in any matches"
                });
            }

            else {
                res.json({
                    statusCode: 200,
                    data: userMatches
                });
            }
        });
};

// api/v1/users/:id/orgs
exports.retrieveUserOrgs = function(db, req, res) {
    db.query(
        "SELECT u.id AS user_id, CONCAT(u.fname, ' ', u.lname) AS user_name, o.id AS org_id, o.oname AS org_name, o.description AS org_description FROM organization_user as ou INNER JOIN users AS u ON ou.user_id = u.id INNER JOIN organizations AS o ON ou.organization_id = o.id WHERE user_id = ?", [req.params.id], function(err, userOrgs) {
            if (err)  {
                res.json({
                    statusCode: 500,
                    message: "Failed to find user organizations"
                });
            }

            if (userOrgs.length === 0) {
                res.json({
                    statusCode: 404,
                    data: "User not found in any organizations"
                });
            }

            else {
                res.json({
                    statusCode: 200,
                    data: userOrgs
                });
            }
        });
};

// api/v1/users/:id/teams
exports.retrieveUserTeams = function(db, req, res) {
    db.query(
        "SELECT * from team_user WHERE user_id = ?", [req.params.id], function(err, userTeams) {
            if (err)  {
                res.json({
                    statusCode: 500,
                    message: "Failed to find user teams"
                });
            }

            if (userTeams.length === 0) {
                res.json({
                    statusCode: 404,
                    data: "User not found in any teams"
                });
            }

            else {
                res.json({
                    statusCode: 200,
                    data: userTeams
                });
            }
        });
};

// api/v1/users/:id/tournaments
exports.retrieveUserTournaments = function(db, req, res) {
    db.query(
        "SELECT u.id AS user_id, CONCAT(u.fname, ' ', u.lname) AS user_name, o.id AS org_id, o.oname AS org_name, o.description AS org_description, l.id AS league_id, l.title AS league_name, l.description AS league_description, t.id AS tournament_id, t.title AS tournament_name, tu.user_rank AS ranking FROM tournament_user as tu INNER JOIN users AS u ON tu.user_id = u.id INNER JOIN tournaments AS t ON tu.tournament_id = t.id INNER JOIN leagues AS l ON t.league_id = l.id INNER JOIN organizations AS o ON l.organization_id = o.id WHERE user_id = ?", [req.params.id], function(err, userTournaments) {
            if (err)  {
                res.json({
                    statusCode: 500,
                    message: "Failed to find user tournaments"
                });
            }

            if (userTournaments.length === 0) {
                res.json({
                    statusCode: 404,
                    data: "User not found in any tournaments"
                });
            }

            else {
                res.json({
                    statusCode: 200,
                    data: userTournaments
                });
            }
        });
};