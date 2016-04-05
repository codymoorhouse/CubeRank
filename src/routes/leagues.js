var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('leagues', { title: 'Leagues' , user: req.user});
});

router.get('/:id/edit', function(req, res, next) {
    res.render('league_edit', { title: 'League' , user: req.user});
});

router.get('/:id', function(req, res, next) {
    res.render('league', { title: 'League' , user: req.user});
});

module.exports = router;
