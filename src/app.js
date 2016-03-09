var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var connect = require('connect');

var mysql = require('mysql');

var contact = require('./routes/contact');
var userprofile = require('./routes/userprofile');
var signup = require('./routes/signup');
var quickcreate = require('./routes/quickcreate');
var about = require('./routes/about');

var routes = require('./routes/index');
var login = require('./routes/login');
var users = require('./routes/users');

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
app.use(bodyParser.urlencoded({ extended: false }));
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
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
