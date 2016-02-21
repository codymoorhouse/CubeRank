var express = require('express');
var nodemailer = require("nodemailer");
var app = express();
var connect = require('connect');



var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        /* We need to make an email for this I tested it with my own email
         * and it worked. Will our hosting site provide email? */
        user: "***@gmail.com",
        pass: "*******"
    }
});

app.get('/', function (req, res) {
    res.sendFile('public/contact.html', {"root": __dirname});
});

app.get('/user-profile', function(req, res){
    res.sendFile('public/user-profile.html', {"root": __dirname});
});

app.use('/', express.static(__dirname + '/contact.html'));

app.get('/send', function (req, res) {
    var mailOptions = {
        to: req.query.to,
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


app.listen(3000, function () {
    console.log("Express Started at localhost:3000");
});

