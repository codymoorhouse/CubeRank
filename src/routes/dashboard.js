var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.user !== undefined) {
        res.render('dashboard', {user: req.user});
    }
    else {
        res.render('login', {user: req.user});
    }
});

module.exports = router;
