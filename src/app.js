var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var connect = require('connect');
var session = require('express-session');
var passport = require('passport');
var local = require('passport-local');

var mysql = require('mysql');

var contact = require('./routes/contact');
var userprofile = require('./routes/userprofile');
var signup = require('./routes/signup');
var quickcreate = require('./routes/quickcreate');
var about = require('./routes/about');

var routes = require('./routes/index');
var login = require('./routes/login');
var users = require('./routes/users');

var userModel = require('./models/users.js');
var leagueModel = require('./models/leagues.js');
var orgModel = require('./models/orgs.js');



var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'CubeRank_admin',
    password: 'password',
    database: 'CubeRank'
});

var app = express();

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        /* We need to make an email for this I tested it with my own email
         * and it worked. Will our hosting site provide email? */
        user: "******@gmail.com",
        pass: "*********"
    }
});

// app.get('/contact', function (req, res) {
//   res.sendFile('public/contact', {"root": __dirname});
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/login', login);
app.use('/users', users);
app.use('/contact', contact);
app.use('/userprofile', userprofile);
app.use('/signup', signup);
app.use('/quickcreate', quickcreate);
app.use('/about', about);


//======================
//=====AUTH=============
app.use(session({
  secret: "mySecretKey",
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new local.Strategy(function(username, password, done){
  // logic for login
}));

passport.serializeUser(function(user, done){
  //
});

passport.deserializeUser(function(id, done){
  //
});

// ---------------------------- Users Resource ---------------------------- //
// ----------------------------  Get Requests  ---------------------------- //
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


// Not sure if this is the right place for this...
app.get('/send', function (req, res) {
    var mailOptions = {
        to: req.query.to,
        from: req.query.from,
        subject: req.query.subject,
        text: req.query.text
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
