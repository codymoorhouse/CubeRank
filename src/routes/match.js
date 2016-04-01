var express = require('express');
var router = express.Router();

/* GET match listing. */
router.get('/', function(req, res, next) {
    res.render('match');
});

module.exports = router;
