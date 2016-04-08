var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var connect = require('connect');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');

var mysql = require('mysql');
var contact = require('./routes/contact');
var signup = require('./routes/signup');
var quickcreate = require('./routes/quickcreate');
var about = require('./routes/about');

var routes = require('./routes/index');
var login = require('./routes/login');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
var settings = require('./routes/settings');
var orgs = require('./routes/orgs');
var leagues = require('./routes/leagues');

var terms = require('./routes/terms');
var privacy = require('./routes/privacy');
var matches = require('./routes/matches');
var ranking = require('./routes/ranking');
var tournaments = require('./routes/tournaments');
var leagueTournament = require('./routes/newtournament');



var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'CubeRank_admin',
    password: 'password',
    database: 'CubeRank'
});

var app = express();

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/public/img', 'favicon.ico')));
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true } // This needs a https site to be turned on
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);
app.use('/login', login);
app.use('/users', users);
app.use('/orgs', orgs);
app.use('/leagues', leagues);
app.use('/contact', contact);
app.use('/signup', signup);
app.use('/quickcreate', quickcreate);
app.use('/about', about);
app.use('/terms', terms);
app.use('/privacy', privacy);
app.use('/matches', matches);
app.use('/leaderboard', ranking);
app.use('/dashboard', dashboard);
app.use('/settings', settings);
app.use('/newtournament/:id', leagueTournament);
app.use('/tournaments', tournaments );

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db.query("select * from users where id = " + id, function(err, rows) {
        done(err, rows[0]);
    });
});

passport.use(new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        db.query("SELECT * FROM users WHERE username = '" + username + "'", function(err, rows) {

            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }
            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, rows[0]);

        });
    }
));

app.get('/tournament/:id', function(req, res){
    res.render('tournament', { user: req.user });
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

var transporter = nodemailer.createTransport('smtps://name@gmail.com:password@smtp.gmail.com');
app.post('/send', function (req, res) {
    var mailOptions = {
        to: "youremail@gmail.com",
        from: req.body.from,
        subject: req.body.subject,
        text: "Email From: " + req.body.from + "\n" + req.body.content
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        }else {
            console.log("Message sent: " + info.response);
        }
        return res.json({
            message: "success"
        });

    });
});


require('./routes.js') (app, passport , db);

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
            error: err,
            user: req.user
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
