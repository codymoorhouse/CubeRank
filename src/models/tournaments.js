// Manage Tournaments Table

//==============CREATE=================

//INSERT INTO tournaments (title, league_id) VALUES (?, ?)
// /tournaments/
exports.createTournament = function(db, req, res){

    db.query("INSERT INTO tournaments (title, league_id) VALUES (?, 1)",
    [ req.body.title, 1 ], function(err){
        if(err){
            res.json({
                statusCode: 500,
                message: "Failed to create new tournament"
            });
        }
        else {
            db.query("SELECT LAST_INSERT_ID()", function (err, tid) {
                if (err) {
                    res.json({
                        statusCode: 500,
                        message: "Failed to create new tournament"
                    });
                }
                else {
                    tid = tid[0]['LAST_INSERT_ID()'];
                    var participants = req.body.names;
                    var queryString = "INSERT INTO matches (match_date, league_id, tournament_id," +
                        "username1, username2, user1_id, user2_id) VALUES " +
                        "(CURDATE(), 1, " + tid + ", '" + participants[0] + "', '"
                        + participants[1] + "', 1, 1)";

                    for (var i = 2; i < participants.length; i += 2) {
                        queryString += ", (CURDATE(), 1, " + tid + ", '" + participants[i] + "', '"
                            + participants[i + 1] + "', 1, 1)"
                    }
                    console.log(queryString);
                    db.query(queryString, function (err) {
                        if (err && !done) {
                            console.log(err);
                            res.json({
                                statusCode: 500,
                                message: "Cannot add users to tournament"
                            });

                        }
                        else{
                            res.json({
                                statusCode: 200,
                                message: 'OK'
                            });
                        }
                    });

                }
            });
        }


    });

};

// INSERT INTO matches (league_id, tournament_id, user1_id, user2_id) VALUES (?, ?, ?, ?)

// /tournaments/{id}/matches
exports.createMatch = function(db, req, res){

    console.log(req.body);
    db.query("INSERT INTO matches (match_date, league_id, tournament_id, user1_id, user2_id, username1, username2)" +
        " VALUES (CURDATE(), 1, ?, ?, ?, (SELECT fName FROM users WHERE id = ?), (SELECT fName FROM users WHERE id = ?))",
        [1, req.params.id, req.body.user1_id, req.body.user2_id, req.body.user1_id, req.body.user2_id], function(err){
        if (err){
            res.json({
                statusCode: 500,
                message: 'Failed to create new match'
            });

        }
        else {
            res.json({
                statusCode: 200,
                message: 'OK'
            });
        }

    });

};


//=============READ======================

//SELECT title FROM tournaments;
// /tournaments

exports.getTournaments = function(db, req, res){
    db.query("SELECT * FROM tournaments", function(err, tournaments){
        if (err){
            res.json({
                statusCode: 404,
                message: "Failed to find tournaments"
            });
            return res;
        }
        res.json({
            statusCode: 200,
            data: tournaments
        });
        return res;
    });
};

//SELECT title FROM tournaments WHERE id = ?;
// /tournaments/{id}

exports.getOneTournament = function(db, req, res){
    db.query("SELECT * FROM tournaments WHERE id = ?", [req.params.id], function(err, tournament){
        if (err){
            res.json({
                statusCode: 404,
                message: 'Failed to find tournament'
            });
            return res;
        }
        res.json({
            statusCode: 200,
            data: tournament
        });
        return res;
    });
};

//SELECT user1_id, user2_id FROM matches WHERE tournament_id = ?;
// /tournaments/{id}/matches

exports.getMatches = function(db, req, res){
    db.query("SELECT * FROM matches",
        [req.params.id], function(err, matches){
        if (err){
            res.json({
                statusCode: 404,
                message: 'Failed to find matches from specified tournament'
            });
        }
        res.json({
            statusCode: 200,
            data: matches
        });

    });
};

//SELECT user1_id, user2_id FROM matches WHERE match_results = NULL;
// /tournaments/{id}/matches?curr

exports.getTournamentMatches = function(db, req, res){

    var query = "SELECT * FROM matches WHERE id = ?"

    if (req.query.hasOwnProperty('curr')){
        query +=  "AND match_result = 0";
    }
    else if (req.query.hasOwnProperty('done')){
        query += "AND (match_result = 2 OR match_result = 1)";
    }

    db.query(query, [req.params.id], function(err, matches){
        if (err){
            res.json({
                statusCode: 404,
                message: "Unable to retrieve matches"
            });
        }
        else {
            res.json({
                statusCode: 200,
                data: matches
            });
        }
    });

};

//SELECT user1_id, user2_id FROM matches WHERE match_id = ?;
// /matches/{id}

exports.getOneMatch = function(db, req, res){
    db.query("SELECT * FROM matches WHERE id = ?", [req.params.id], function(err, match){
       if (err) {
           res.json({
               statusCode: 404,
               message: "Failed to find match"
           });
       }
       else {
           res.json({
               statusCode: 200,
               data: match
           });
       }
    });
};


//==============UPDATE======================

//UPDATE tournaments SET title='?' WHERE id = ?;

exports.updateTournament = function(db, req, res){

    db.query("UPDATE tournaments SET title = ? WHERE id = ? ;", [req.body.title, req.params.id],
    function(err){
        if (err) {
            res.json({
                statusCode: 500,
                message: "failed to update tournament title"
            });
        }
        else {
            res.json({
                statusCode: 200,
                message: 'OK'
            });

        }
    });
};


//UPDATE matches SET match_result=? WHERE id = ?;

exports.updateMatches = function(db, req, res){
    db.query("UPDATE matches SET match_result = ? WHERE id = ?", [req.body.winner, req.params.id],
    function(err){
        if (err) {
            res.json({
                statusCode: 500,
                message: "failed to update match winner"
            });
        }
        else {
            res.json({
                statusCode: 200,
                message: 'OK'
            });
        }
    });
};

//================DELETE=====================

//DELETE FROM tournaments WHERE id = ?;

exports.deleteTournament = function(db, req, res){
    db.query("DELETE FROM tournaments WHERE id = ?", [req.params.id], function(err){
        if (err){
            res.json({
                statusCode: 500,
                message: "Could not delete tournament"
            });

        }
        else {
            res.json({
                statusCode: 200,
                message: 'OK'
            });
        }
    });
};

//DELETE FROM matches WHERE id = ?;

exports.deleteMatch = function(db, req, res) {
    db.query("DELETE FROM matches WHERE id = ?", [req.params.id], function (err) {
        if (err) {
            res.json({
                statusCode: 500,
                message: "Could not delete match"
            });

        }
        else {
            res.json({
                statusCode: 200,
                message: 'OK'
            });
        }
    });
};



