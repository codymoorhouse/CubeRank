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



// api/v1/matches/:id
exports.updateMatch = function(db, req, res) {

    var match_date = req.body.match_date;
    var username1 = req.body.username1;
    var username2 = req.body.username2;
    var match_result = req.body.match_result;
    var tournament_id = req.body.tournament_id;
    var user1_id = user1_id;
    var user2_id = user2_id;

    db.query(
        "SELECT * FROM matches WHERE id = ?", [req.params.id], function(err, data) {
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
                if (req.body.match_date === undefined || req.body.match_date === null)  match_date = data[0]['match_date'];
                if (req.body.user1_id === undefined || req.body.user1_id === null) user1_id = data[0]['user1_id'];
                if (req.body.user2_id === undefined || req.body.user2_id === null) user2_id = data[0]['user2_id'];

                db.query(
                    "UPDATE matches SET match_date = ?, match_result = ?, tournament_id = ?, user1_id = ?, user1_id = ? WHERE id = ?", [
                        match_date,
                        match_result,
                        tournament_id,
                        user1_id,
                        user2_id,
                        req.params.id],

                    function(err) {
                        if (err)  {
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
