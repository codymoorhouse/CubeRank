var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('settings', { user: req.user });
});


module.exports = router;
