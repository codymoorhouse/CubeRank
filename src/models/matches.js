exports.retrieveMatch = function(db, req, res) {
    db.query(
        "SELECT * FROM matches WHERE id = ?", [req.params.id], function(err, match) {
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
                    data: match
                });
            }
        });
};

// api/v1/match/:id
exports.updateMatch = function (db, req, res) {
    var title = req.body.title;
    var description = req.body.description;

    db.query(
        "SELECT * FROM CubeRank.matches WHERE id = ?", [req.params.id], function (err, data) {
            if (err) {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to retrieve match record"
                });
            }

            if (data.length === 0) {
                res.status(404);
                res.json({
                    statusCode: 404,
                    data: "match not found"
                });
            }

            else {
                if (req.body.match_result === undefined || req.body.fname === null)  match_result = data[0]['match_result'];
                if (req.body.user1_id === undefined || req.body.user1_id === null)  user1_id = data[0]['user1_id'];
                if (req.body.user2_id === undefined || req.body.user2_id === null) user2_id = data[0]['user2_id'];

                db.query(
                    "UPDATE CubeRank.leagues SET match_result = ?, user1_id = ?, user2_id = ? WHERE id = ?", [
                        match_result,
                        user1_id,
                        user2_id,
                        req.params.id],

                    function (err) {
                        if (err) {
                            res.status(500);
                            res.json({
                                statusCode: 500,
                                message: "Failed to update match record"
                            });
                        }

                        else {
                            res.status(200);
                            res.json({
                                statusCode: 200,
                                message: "match updated"
                            });
                        }
                    });
            }
        });


};

// DELETE /api/matches/:id
exports.deleteMatch = function(db, req, res) {
    db.query(
        "DELETE FROM matches WHERE id = ?", [req.params.id], function(err) {
            if (err)  {
                res.status(500);
                res.json({
                    statusCode: 500,
                    message: "Failed to delete match"
                });
            }

            else {
                res.status(200);
                res.json({
                    statusCode: 200,
                    message: "match was deleted"
                });
            }
        });
};