// Manage Tournaments Table


//==============CREATE=================

//INSERT INTO tournaments (title, league_id) VALUES (?, ?)
// /tournaments
exports.createTournament = function(db, req, res){
    db.query("INSERT INTO tournaments (title, league_id) VALUES (?, ?)",
    [
        req.body.title,
        req.body.league_id,
    ]), function(err){
        if(err){
            res.json({
                statusCode: 500,
                message: "Failed to create new tournament"
            });
        }
        db.query("SELECT LAST_INSERT_ID()", function(err, id) {
            if (err) {
                res.json({
                    statusCode: 500,
                    message: "Failed to create new tournament"
                });
            }
        });

        if (id[0]['LAST_INSERT_ID()'] === 0 ){
            res.json({
                statusCode: 409,
                message: "You have already created a tournament with this name"
            });
        }
    }
}

// INSERT INTO matches (league_id, tournament_id, user1_id, user2_id) VALUES (?, ?, ?, ?)

// /tournaments/{id}/matches
exports.createMatch = function(db, req, res){
    db.query("INSERT INTO matches (league_id, tournament_id, user1_id, user2_id)" +
        " VALUES (?, ?, ?, ?)", function(err){
        if (err){
            res.json({
                statusCode: 500,
                message: 'Failed to create new match'
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
                statusCode: 500,
                message: "Failed to find tournaments"
            });
        }
        res.json({
            statusCode: 200,
            data: tournaments
        });
    });
};

//SELECT title FROM tournaments WHERE id = ?;
// /tournaments/{id}

exports.getOneTournament = function(db, req, res){
    db.query("SELECT * FROM tournaments WHERE id = ?", [req.params.id], function(err, tournament){
        if (err){
            res.json({
                statusCode: 500,
                message: 'Failed to find tournament'
            });
        }
        res.json({
            statusCode: 200,
            data: tournament
        });
    });
};

//SELECT user1_id, user2_id FROM matches WHERE tournament_id = ?;
// /tournaments/{id}/matches

exports.getMatches = function(db, req, res){
    db.query("SELECT * FROM matches WHERE tournament_id = ?",
        [req.params.id], function(err, matches){
        if (err){
            res.json({
                statusCode: 500,
                message: 'Failed to find matches from specified tournament'
            });
        }
        res.json({
            statusCode: 200,
            data: matches
        })
    });
};

//SELECT user1_id, user2_id FROM matches WHERE match_results = NULL;
// /tournaments/{id}/matches?curr

exports.getMatches = function(db, req, res){
    if (req.query.curr == true){
        db.query("SELECT user1_id, user2_id FROM matches, tournaments " +
            "WHERE match.id = ? AND match_results != NULL", [req.params.id],
            function(err, matches){
                if (err){
                    res.json({
                        statusCode: 500,
                        message: "Unable to retrieve matches"
                    });
                }
                res.json({
                    statusCode: 200,
                    data: matches
                });
            });
    }
    else if(req.query.done == true){
        db.query("SELECT user1_id, user2_id FROM matches, tournaments " +
            "WHERE match.id =  ? AND match_results = NULL", [req.params.id],
            function(err, matches){
                if (err){
                    res.json({
                        statusCode: 500,
                        message: "Unable to retrieve matches"
                    });
                }
                res.json({
                    statusCode: 200,
                    data: matches
                });
            });
    }
    else{
        db.query("SELECT user1_id, user2_id FROM matches, tournaments " +
            "WHERE match.id = ?", [req.params.id],
            function(err, matches){
                if (err){
                    res.json({
                        statusCode: 500,
                        message: "Unable to retrieve matches"
                    });
                }
                res.json({
                    statusCode: 200,
                    data: matches
                });
            });
    }

};

//SELECT user1_id, user2_id FROM matches WHERE match_id = ?;
// /matches/{id}

exports.getOneMatch = function(db, req, res){
    db.query("SELECT * FROM matches WHERE id = ?", [req.param.id], function(err, match){
       if (err){
           res.json({
               statusCode: 500,
               message: "Failed to find match"
           });
       }
       res.json({
           statusCode: 200,
           data: match
       });
    });
};


//==============UPDATE======================

//UPDATE tournaments SET title='?' WHERE id = ?;

exports.updateTournament = function(db, req, res){
    db.query("UPDATE tournaments SET title='?' WHERE id = ?", [req.query.title, req.params.id],
    function(err){

    });
};


//UPDATE matches SET match_result=? WHERE id = ?;

//DELETE FROM tournaments WHERE id = ?;
//DELETE FROM matches WHERE id = ?;


