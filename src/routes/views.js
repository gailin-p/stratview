// dependencies
const express = require('express');
const router = express.Router();

// public endpoints
router.get('/new', function(req, res, next) {
  res.sendFile('new.html', { root: 'src/views' });
});

router.get('/', function(req, res, next) {
  res.sendFile('home.html', { root: 'src/views' });
});

module.exports = router;
