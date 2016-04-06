var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('matches', { title: 'Matches' , user: req.user});
});

router.get('/create', function(req, res, next) {
    res.render('match_create', { title: 'Create a match', user: req.user});
});

router.get('/:id/edit', function(req, res, next) {
    res.render('match_update', { title: 'Matches', user: req.user})
});

router.get('/:id', function(req, res, next) {
    res.render('matchs', { title: 'Match', user: req.user})
});



module.exports = router;
