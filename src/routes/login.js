var express = require('express');
var passport = require('passport');
var local = require('passport-local');

var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/',
    passport.authenticate('local', {session: true}),
        function (req, res, next) {
            res.redirect('dashboard');
        }
);

module.exports = router;
