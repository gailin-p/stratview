// libraries
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
require('dotenv').config();
var auth = require('http-auth');

// local dependencies 
const db = require('./db');
const views = require('./routes/views');
const api = require('./routes/api');
const util = require('./routes/util'); 

// initialize express app and authentication. 
// Modeled off https://www.npmjs.com/package/http-auth 
var basic = auth.basic({
  realm: "Dev Area."
  }, (username, password, callback) => { 
  // Custom authentication
  callback(username === process.env.USR && password === process.env.PW);
}
);

// Application setup.
var app = express();
app.use(auth.connect(basic));

// set POST request body parser - source catbook 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set routes
app.use('/', views);
app.use('/api', api);
//app.use('/util', util) // database utilities. Not for the faint of heart. 
app.use('/static', express.static('public'));

// 404 route
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// route error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message,
  });
});

// port config
const port = process.env.PORT || 3000;
const server = http.Server(app);
server.listen(port, function() {
  console.log('Server running on port: ' + port);
});
