var express = require('express');
var router = express.Router();

/* GET ranking listing. */
router.get('/', function(req, res, next) {
    res.render('ranking');
});

module.exports = router;
