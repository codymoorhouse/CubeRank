var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('orgs', { title: 'Organizations' , user: req.user});
});

router.get('/create', function(req, res, next) {
    res.render('org_create', { title: 'Create an organization', user: req.user});
});

router.get('/:id/edit', function(req, res, next) {
    res.render('org_update', { title: 'Organization', user: req.user})
});

router.get('/:id/create-league', function(req, res, next) {
    res.render('league_create', { title: 'Organization', user: req.user})
});

router.get('/:id', function(req, res, next) {
    res.render('org', { title: 'Organization', user: req.user})
});



module.exports = router;
