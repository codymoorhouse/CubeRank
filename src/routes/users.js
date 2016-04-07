var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { user: req.user });
});

router.get('/:id', function(req, res, next) {
  res.render('profile', { user: req.user });
});

module.exports = router;
