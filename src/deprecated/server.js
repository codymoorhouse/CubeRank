var express = require('express');
var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var app = express();
app.set('view-engine', 'ejs');
var flash = require('connect-flash');

<<<<<<< Updated upstream:src/deprecated/server.js
=======
/*
* modules for secure authentication
* npm install express-session passport passport-local
*/
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');

//app.use(session({
//    secret: 'open cube rank',   // key to encrypt sessions
//    resave: false,               // session expires after certain time period
//    saveUninitialized: false    // sessions won't be stored until something is in them
//}));

passport.use(new LocalStrategy(function(username,password,done){
        connection.query("select * from Users where username='"+username+"'     ",function(err,user){
            if(err)
            {
                return done(err);
            }
            if(!user)
            {
                return done(null,false,{message: 'Incorrect user name'});
            }
            if(user.password != password)
            {
                return done(null,false,{message: 'Incorrect password'});
            }

            return done(null,user);

        });
    }
));

>>>>>>> Stashed changes:src/server.js
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        /* We need to make an email for this I tested it with my own email
         * and it worked. Will our hosting site provide email? */
        user: "******@gmail.com",
        pass: "*********"
    }
});

app.get('/', function (req, res) {
    res.sendFile('public/home/contact.html', {"root": __dirname});
});

app.get('/user-profile', function(req, res){
    res.sendFile('public/user-profile.html', {"root": __dirname});
});

app.use(express.static(__dirname + '/public')); // this gets all the static files stylesheets and js???

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

require('./config/passport')(passport); // pass passport for configuration

// required for passport
app.use(session({
    secret: 'SecretKeyGoes Here',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(3000, function () {
    console.log("Express Started at localhost:3000");
});

