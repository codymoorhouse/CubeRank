var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.user !== undefined) {
        res.render('settings', {user: req.user});
    }
    else {
        res.render('login', {user: req.user});
    }
});


module.exports = router;
