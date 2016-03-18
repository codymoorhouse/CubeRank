

// GET /api/orgs
exports.retrieveOrgs = function(db, req, res) {
    db.query(
        "SELECT id, oname AS name, description FROM organizations", function(err, orgs) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to retrieve organizations"
                });
            }

            else {
                res.status(200);
                res.json({
                    statusCode: 200,
                    data: orgs
                });
            }
        });
};

// POST /api/orgs
exports.createOrg = function(db, req, res) {
    var fields = [];
    if (req.body.name === undefined || req.body.name === null)               fields.push("name");
    if (req.body.description === undefined || req.body.description === null) fields.push("description");
    console.log(req.body.name);

    if (fields.length === 0) {
        db.query(
            "INSERT INTO organizations (oname, description) VALUES (?, ?)",
            [
                req.body.name,
                req.body.description
            ], function (err) {
                if (err) {
                    res.status(500);
                    res.json({
                        statusCode: 500,
                        message: "Failed to create new organization"
                    });
                } else {
                    res.status(200);
                    res.json({
                        statusCode: 200,
                        message: "New organization added"
                    });
                }
            }
        );
    } else {
        var response = "Failed to create new organization (fields not specified): ";

        console.log(fields.join(','));
        res.status(412);
        res.json({
            statusCode: 412,
            message: response + fields.join(', ')
        });
    }
};

// GET /api/orgs/:id
exports.retrieveOrg = function(db, req, res) {
    db.query(
        "SELECT id, oname AS name, description FROM organizations WHERE id = ?", [req.params.id], function(err, org) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find organization"
                });
            }

            else {
                res.status(200);
                res.json({
                    statusCode: 200,
                    data: org
                });
            }
        });
};

// PUT /api/orgs/:id
exports.updateOrg = function(db, req, res) {
    db.query(
        "SELECT * FROM organizations WHERE id = ?", [req.params.id], function(err, org) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to retrieve organization"
                });
            }

            else if (org.length === 0) {
                res.status(404);
                res.json({
                    statusCode: 404,
                    message: "Failed to find organization"
                });
            }

            else {
                db.query(
                    "UPDATE organizations SET oname = ?, description = ? WHERE id = ?",
                    [
                        (req.body.name === null || req.body.name === undefined ? org[0]['oname'] : req.body.name),
                        (req.body.description === undefined ? org[0]['description'] : req.body.description),
                        req.params.id
                    ], function(err) {
                        if (err) {
                            res.status(500);
                            res.json({
                                statusCode: 500,
                                message: "Failed to update organization"
                            });
                        }

                        else {
                            res.status(200);
                            res.json({
                                statusCode: 200,
                                message: "Organization updated"
                            });
                        }
                    }
                );
            }
        });
};

// DELETE /api/orgs/:id
exports.deleteOrg = function(db, req, res) {
    db.query(
        "DELETE FROM organizations WHERE id = ?", [req.params.id], function(err) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to delete organization"
                });
            }

            else {
                res.status(200);
                res.json({
                    statusCode: 200,
                    message: "Organization was deleted"
                });
            }
        });
};

// GET /api/orgs/:id/leagues
exports.retrieveOrgLeagues = function(db, req, res) {
    db.query(
        "SELECT id, title, description FROM leagues WHERE organization_id = ?", [req.params.id], function(err, leagues) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find leagues"
                });
            }

            else {
                res.status(200);
                res.json({
                    statusCode: 200,
                    data: leagues
                });
            }
        });
};

// POST /api/orgs/:id/leagues
exports.createLeague = function(db, req, res) {
    var fields = [];
    if (req.body.title === undefined || req.body.title === null)             fields.push("title");
    if (req.body.description === undefined || req.body.description === null) fields.push("description");
    console.log(req.body.name);

    if (fields.length === 0) {
        db.query(
            "INSERT INTO leagues (title, description, organization_id) VALUES (?, ?, ?)",
            [
                req.body.title,
                req.body.description,
                req.params.id
            ], function (err) {
                if (err) {
                    res.status(500);
                    res.json({
                        statusCode: 500,
                        message: "Failed to create new league"
                    });
                } else {
                    res.status(200);
                    res.json({
                        statusCode: 200,
                        message: "New organization league"
                    });
                }
            }
        );
    } else {
        var response = "Failed to create new league (fields not specified): ";

        console.log(fields.join(','));
        res.status(412);
        res.json({
            statusCode: 412,
            message: response + fields.join(', ')
        });
    }
};

// GET /api/orgs/:id/tournaments
exports.retrieveOrgTournaments = function(db, req, res) {
    db.query(
        "SELECT tournaments.id, tournaments.title, league_id FROM leagues, tournaments WHERE organization_id = ? AND " +
        "leagues.id = tournaments.league_id", [req.params.id], function(err, tournaments) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find tournaments"
                });
            }

            else {
                res.status(200);
                res.json({
                    statusCode: 200,
                    data: tournaments
                });
            }
        });
};

// GET /api/orgs/:id/users
exports.retrieveOrgUsers = function(db, req, res) {
    db.query(
        "SELECT user_id, user_role, username FROM organization_user, users WHERE organization_id = ? AND " +
        "organization_user.user_id = users.id",
        [req.params.id], function(err, users) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to find tournaments"
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