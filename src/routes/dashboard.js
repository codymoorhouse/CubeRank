var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.user);
    if (req.user !== undefined) {
        res.render('dashboard', {user: req.user});
    }
    else {
        res.render('login');
    }
});

module.exports = router;
