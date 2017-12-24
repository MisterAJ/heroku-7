'use strict';
// var express = require('express');
 
// load modules
var express = require('express'),
    jsonParser = require('body-parser').json,
    mongoose = require('mongoose'),
    therapies = require('./routes/therapies'),
    users = require('./routes/users'),
    index = require('./routes/index'),
    auth = require('./routes/auth'),
    bodyParser = require('body-parser'), //very important 
    methodOverride = require('method-override'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    session = require ('express-session'),
    MongoStore = require('connect-mongo')(session),
    User = require("./models/user"),
    Twit       = require('twit'),
    config     = require('./src/config'),     // Object literal containing Twitter                                      //API access key and token
    moment = require('moment');
 
// var app = express();
var path = require('path');

var port = process.env.PORT || 1337;
console.log("Welcome to a live site!");

var http = require("http");
var fs = require("fs");
var path = require("path");

// var port = 1337;

var server = http.createServer(function(request, response) {
  console.log('log create Server');
  // response.writeHead(200, {'Content-Type': 'text/plain' });
  // response.end('Helloooo World\n');
}).listen(port, function() {
  console.log("SServer running at http://our site " + port + "/");
});

