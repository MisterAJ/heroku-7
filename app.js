'use strict';
// var express = require('express');
 
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
  response.writeHead(200, {'Content-Type': 'text/plain' });
  response.end('Helloooo World\n');
}).listen(port, function() {
  console.log("SServer running at http://our site " + port + "/");
});

