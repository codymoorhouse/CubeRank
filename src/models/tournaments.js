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
                    console.log(participants);
                    var queryString = "INSERT INTO matches (match_date, league_id, tournament_id," +
                        "username1, username2, user1_id, user2_id) VALUES " +
                        "(CURDATE(), 1, " + tid + ", '" + participants[0] + "', '"
                        + participants[1] + "', 1, 1)";

                    for (var i = 2; i < participants.length; i += 2) {
                        queryString += ", (CURDATE(), 1, " + tid + ", '" + participants[i] + "', '"
                            + participants[i + 1] + "', 1, 1)"
                    }
                    //console.log(queryString);
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
                                data: tid
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
    var selectClause = "SELECT l.id AS league_id, l.title AS league_name, l.description AS league_description, m.tournament_id AS tournament_id,  u1.id AS player1_id, CONCAT(u1.fname, ' ', u1.lname) AS player1_name, u2.id AS player2_id, CONCAT(u2.fname, ' ', u2.lname) AS player2_name, m.id AS match_id, DATE_FORMAT(m.match_date, '%M %d, %Y') AS match_date, DATE_FORMAT(m.match_date, '%H:%i HRS') AS match_time, CASE match_result WHEN 0 THEN 'draw' WHEN 1 THEN CONCAT(u1.fname, ' ', u1.lname) WHEN 2 THEN CONCAT(u2.fname, ' ', u2.lname) ELSE 'incomplete' END AS match_winner ";
    var fromClause = "FROM matches AS m INNER JOIN users AS u1 ON m.user1_id = u1.id INNER JOIN users AS u2 ON m.user2_id = u2.id INNER JOIN leagues AS l ON m.league_id = l.id ";
    db.query(selectClause + fromClause,
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

    var query = "SELECT * FROM matches WHERE tournament_id = ?"

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


exports.getTournamentInfo = function (db, req, res){
    var queryString = "SELECT tournaments.id, tournaments.title, leagues.title as league_title," +
        "leagues.id as league_id FROM tournaments INNER JOIN " +
        "leagues ON tournaments.league_id=leagues.id ORDER BY tournaments.id ASC";
    db.query(queryString, function(err, data){
        if (err){
            console.log(err);
            res.json({
                statusCode: 500,
                message: "Could not get league names",
                data: err
            });
        }
        else{
            res.json({
                statusCode: 200,
                data: data
            });
        }
    })
};

exports.updateMatches = function(db, req, res){

    db.query('SELECT FIRST(id) FROM matches WHERE tournament_id = ?', [req.body.tournament_id]),
        function(err, firstMatchId){
            if (err){
                res.json({
                    statusCode: 404,
                    message: "Could not find tournament"
                });
            }
            else{
                // the jQuery library that I'm using for the information posts its data as so:
                // {"teams":[["Team 1","Team 2"],["Team 3","Team 4"]],
                // "results":[[
                // [[1,0],[2,7]],
                // [[1,2], [1,3]]
                // ]]}
                // let's just say I was very disappointed with it :(

                var matchId = firstMatchId + 1;
                var queryString = "INSERT INTO matches (id, match_results) VALUES ";
                var matches = req.body.results;
                if (matches[0][0][0][0] < matches[0][0][0][1]){
                    queryString += "(" + firstMatchId + ", 1)";
                }
                else{
                    queryString += "(" + matches[0][0][0][0] + ", 2)";
                }
                for (var i = 0; i < matches.length; i++){
                    for (var j = 0; j < matches[i].length; j++){
                        for (var k = 1; k < matches[i][j].length; k++){
                            if (matches[i][j][k][0] < matches[i][j][k][1]){
                                queryString += ", (" + matchId + ", 1)";
                                matchId++;
                            }
                        }
                    }
                }
                queryString += "ON DUPLICATE KEY UPDATE id=VALUES(id)," +
                    "match_results = VALUES(match_results);"
                db.query(queryString, function(err){
                   if (err){
                       res.json({
                           statusCode: 500,
                           message: "Could not update tournament matches"
                       });
                   }
                   else{
                       res.json({
                           statusCode: 200,
                           message: "OK"
                       });
                   }
                });
            }

        }


};

//UPDATE matches SET match_result=? WHERE id = ?;

exports.updateMatch = function(db, req, res){
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



