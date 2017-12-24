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
 
var app = express();
var path = require('path');

var port = process.env.PORT || 1337;
console.log("Welcome to a live site!");

var http = require("http");
var fs = require("fs");
var path = require("path");

// var port = 1337;

// var server = http.createServer(function(request, response) {
//   console.log('log create Server');
//   // response.writeHead(200, {'Content-Type': 'text/plain' });
//   // response.end('Helloooo World\n');
// }).listen(port, function() {
//   console.log("SServer running at http://our site " + port + "/");
// });

function generateOrFindUser(accessToken, refreshToken, profile, done){
  if(profile.emails[0]){
    User.findOneAndUpdate({
      email: profile.emails[0].value
    }, {
      name: profile.displayName || profile.username,
      email: profile.emails[0].value,
      photo: profile.photos[0].value
    }, {
      upsert: true
    }, 
    done);
  }else {
    var noEmailError = new Error('Your email privacy settings prevent you from signing into Seach Very Easy ')
    done(noEmailError, null);
  }  
};

// Configure Facebook Strategy
// I struggled getting this to work. Make sure to add the product
// Facebook Login(From Your Facebook Developers App)
// and make sure all of the urls and callbacks are correct
// gulp.task('compileSass', function() {

// router.get('/register', mid.loggedOut, function(req, res, next){
passport.use(new FacebookStrategy({
// passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "https://search-very-simple-1-martinmars.c9users.io/auth/facebook/return",
  profileFields: ['id', 'displayName', 'photos', 'email']
}, generateOrFindUser));

passport.serializeUser(function(user, done){
  done(null, user._id);
});
passport.deserializeUser(function(userId, done){
  User.findById(userId, done);
});

// use sessions for tracking logins
app.use(session({
  secret: 'treehouse loves you',
  resave: true,
  saveUninitialized: false
}));

// make user ID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  res.locals.admin = req.session.admin;
  res.locals.tweets = req.session.tweets;
  next();
});

//route handling - - very important for put routes to work
app.use(methodOverride('_method'));

// parse incoming requests
app.use(jsonParser());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/search-therapy', function(err) {
  if(err) {
    console.log('Failed connecting to Mongodb');
  } else {
    console.log('Successfully connected to Mongo');
  }
});

var db = mongoose.connection;

//Sessioun Config for passport
var sessionOptions = {
  secret: "This is the secret to getting enough sleep.",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
};

app.use(session(sessionOptions));

//Initialize Passport
app.use(passport.initialize());

//Restore Session
app.use(passport.session());

// set our port
app.set('port', process.env.PORT || 5000);

// setup our static route to serve files from the "public" folder
app.use('/static', express.static(__dirname +'/src/public'));

// setup our views
app.set('view engine', 'pug');  
app.set('views', __dirname + '/src/public/templates'); //Use __dirname since we
//sometimes run with a nodemon command with a path to the server.js file.

// app.use('/', therapies);
app.use('/therapies', therapies);
app.use('/users', users);
app.use('/', index);
app.use('/auth', auth);
app.use('/profile', index );
app.use('/register', index );
app.use('/twitter', index);

// routes handling
app.use('/api/', therapies);
app.use('/api/therapies', therapies);
// app.use('/api/login', login);

// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('AppError', {
      message: err.message,
      error: {}
    });
  });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('AppError', {
//     message: err.message,
//     error: {}
//   });
// });


// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});

module.exports = app;

