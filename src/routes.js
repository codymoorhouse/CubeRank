module.exports = function (app, passport, db) {

    app.get('/signup', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/signup', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true, // allow flash messages
        passReqToCallback: true
    }));
    
    var userModel = require('./models/users.js');
    var leagueModel = require('./models/leagues.js');
    var orgModel = require('./models/orgs.js');
    var tournamentModel = require('./models/tournaments.js');

// ---------------------------- Users Resource ---------------------------- //
// ----------------------------  Get Requests  ---------------------------- //

    app.get('/api/v1/tournaments', function (req, res) {
        tournamentModel.getTournaments(db, req, res);
    });

    app.get('/api/v1/matches', function (req, res) {
        tournamentModel.getMatches(db, req, res);
    });

    app.get('/api/v1/tournaments/:id/matches', function (req, res) {
        tournamentModel.getTournamentMatches(db, req, res);
    });

    app.get('/api/v1/tournaments/:id', function (req, res) {
        tournamentModel.getOneTournament(db, req, res);
    });

    app.get('/api/v1/matches/:id', function (req, res) {
        tournamentModel.getOneMatch(db, req, res);
    });

    app.get('/api/v1/users', function (req, res) {
        userModel.retrieveUsers(db, req, res);
    });

    app.get('/api/v1/users/:id', function (req, res) {
        userModel.retrieveUser(db, req, res);
    });

    app.get('/api/v1/users/:id/leagues', function (req, res) {
        userModel.retrieveUserLeagues(db, req, res);
    });

    app.get('/api/v1/users/:id/matches', function (req, res) {
        userModel.retrieveUserMatches(db, req, res);
    });

    app.get('/api/v1/users/:id/orgs', function (req, res) {
        userModel.retrieveUserOrgs(db, req, res);
    });

    app.get('/api/v1/users/:id/teams', function (req, res) {
        userModel.retrieveUserTeams(db, req, res);
    });

    app.get('/api/v1/users/:id/tournaments', function (req, res) {
        userModel.retrieveUserTournaments(db, req, res);
    });

    app.get('/api/v1/leagues', function (req, res) {
        leagueModel.retrieveLeagues(db, req, res);
    });

    app.get('/api/v1/leagues/:id', function (req, res) {
        leagueModel.retrieveLeagueId(db, req, res);
    });

    app.get('/api/v1/leagues/:id/matches', function (req, res) {
        leagueModel.retrieveLeagueMatchId(db, req, res);
    });

    app.get('/api/v1/leagues/:id/tournaments', function (req, res) {
        leagueModel.retrieveLeagueTournamentId(db, req, res);
    });

    app.get('/api/v1/leagues/:id/users', function (req, res) {
        leagueModel.retrieveLeagueUserId(db, req, res);
    });

    app.get('/api/v1/leagues/:id/userRanks', function (req, res) {
        leagueModel.retrieveUserRanks(db, req, res);
    });

    app.get('/api/v1/orgs', function (req, res) {
        orgModel.retrieveOrgs(db, req, res);
    });

    app.get('/api/v1/orgs/:id', function (req, res) {
        orgModel.retrieveOrg(db, req, res);
    });

    app.get('/api/v1/orgs/:id/leagues', function (req, res) {
        orgModel.retrieveOrgLeagues(db, req, res);
    });

    app.get('/api/v1/orgs/:id/tournaments', function (req, res) {
        orgModel.retrieveOrgTournaments(db, req, res);
    });

    app.get('/api/v1/orgs/:id/users', function (req, res) {
        orgModel.retrieveOrgUsers(db, req, res);
    });

// ----------------------------  Post Requests ---------------------------- //

    app.post('/api/v1/tournaments/', function (req, res) {
        tournamentModel.createTournament(db, req, res);
    });

    app.post('/api/v1/tournaments/:id/matches/', function (req, res) {
        tournamentModel.createMatch(db, req, res);
    });

    app.post('/api/v1/users', function (req, res) {
        userModel.createUser(db, req, res);
    });

    app.post('/api/v1/leagues/:id/matches', function (req, res) {
        leagueModel.createMatch(db, req, res);
    });

    app.post('/api/v1/leagues/:id/tournaments', function (req, res) {
        leagueModel.createTournament(db, req, res);
    });

    app.post('/api/v1/leagues/:id/users', function (req, res) {
        leagueModel.createUserLeague(db, req, res);
    });

    app.post('/api/v1/orgs', function (req, res) {
        orgModel.createOrg(db, req, res);
    });

    app.post('/api/v1/orgs/:id/leagues', function (req, res) {
        orgModel.createLeague(db, req, res);
    });

// ----------------------------  Put Requests  ---------------------------- //

    app.put('/api/v1/tournaments/:id', function (req, res) {
        tournamentModel.updateTournament(db, req, res);
    });

    app.put('/api/v1/matches/:id', function (req, res) {
        tournamentModel.updateMatches(db, req, res);
    });

    app.put('/api/v1/users/:id', function (req, res) {
        userModel.updateUser(db, req, res);
    });

    app.put('/api/v1/leagues/:id', function (req, res) {
        leagueModel.updateLeague(db, req, res);
    });

    app.put('/api/v1/orgs/:id', function (req, res) {
        orgModel.updateOrg(db, req, res);
    });

// ----------------------------  Delete Requests  ------------------------- //


    app.delete('/api/v1/tournaments/:id', function (req, res) {
        tournamentModel.deleteTournament(db, req, res);
    });

    app.delete('/api/v1/matches/:id', function (req, res) {
        tournamentModel.deleteMatch(db, req, res);
    });

    app.delete('/api/v1/users/:id', function (req, res) {
        userModel.deleteUser(db, req, res);
    });

    app.delete('/api/v1/leagues/:id', function (req, res) {
        leagueModel.deleteLeague(db, req, res);
    });

    app.delete('/api/v1/leagues/:id/users', function (req, res) {
        leagueModel.deleteLeagueUser(db, req, res);
    });

    app.delete('/api/v1/orgs/:id', function (req, res) {
        orgModel.deleteOrg(db, req, res);
    });
// -------------------------- End Users Resource -------------------------- //

};