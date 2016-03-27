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

var terms = require('./routes/terms');
var privacy = require('./routes/privacy');
var match = require('./routes/match');
var ranking = require('./routes/ranking');


var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'CubeRank_admin',
    password: 'password',
    database: 'CubeRank'
});

var app = express();


var transporter = nodemailer.createTransport('smtps://adamepp123@gmail.com:password@smtp.gmail.com');

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/public/img', 'favicon.ico')));
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
app.use('/terms', terms);
app.use('/privacy', privacy);
app.use('/match', match);
app.use('/leaderboard', ranking);

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
    done(null, user._id);
});

passport.deserializeUser(function(id, done){
  //
});



app.post('/quickcreate', function(req, res){
    req.body.names = req.body.participants.split('\r\n');
    //console.log(req.body);
    tournamentModel.createTournament(db, req, res);

});

// Not sure if this is the right place for this...
app.get('/send', function (req, res) {
    var mailOptions = {
        to: req.query.to,
        from: req.query.from,
        subject: req.query.subject,
        text: req.query.text
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        }
        console.log("Message sent: " + info.response);

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
