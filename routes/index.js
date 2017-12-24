'use strict';

var express = require('express'),
    router = express.Router(),
    Therapy = require('../models/therapy.js'),
    User = require('../models/user.js'),
    mid = require('../middleware'),
    Twit       = require('twit'),
    config     = require('../src/config'),     // Object literal containing Twitter                                      //API access key and token
    moment = require('moment');
    
    
var object = {}, //new Object literal notation
    tweets = {},
    messages = {},
    page,
    errorMsg	 = '',
    banner,
    services = [];

// Initialise application
var T = new Twit(config);

var params = {         //Parameters are used in our calls to Twitter
  screen_name: 'martykunsman',
  count: 5
};

// GET / all therapies
// Get / all therapies
router.get('/', function(req, res, next){
  Therapy.find({})
    .exec(function(err, therapies){
    if(err) {
      return next(err);
    }
    res.render("index", {therapies: therapies, title: "Therapies" });
    // res.json({therapies: therapies});
    });
});

// GET /twitter Latest Tweets for SearchTherapy
router.get('/twitter', function(req, res, next){
  var account = T.get('account/settings', params, gotAccount) //This retrieves hd screenname
  .then(function(account){
    var tweets = T.get('statuses/user_timeline', params, gotDataTweets)
    .then(function(tweets){
      res.render("twitter", {
        account: account.data,
        tweets: tweets.data,
        title: "Latest Tweets from Search Therapy"
      }); // end render function
    }); // end then
  }); // end then
});



/* GET login page */
router.get('/login', function(req, res) {
  res.render('login', { 
      title: 'Facebook Log In', 
      // user: req.user 
  });
});

// POST /login
router.post('/login', function(req, res, next){
});

// GET /logout
router.get('/logout', function(req, res, next){
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');  
      }
    });
  }
});


/* GET profile page */
router.get('/profile', function(req, res, next) {
  if(! req.user) {
    var error = "You are not authorized to view this page.";
    return res.render('profile', {
        error: error
    });
  } else {
    User.findById(req.user._id) 
        .exec(function (error,user){
          if(error) {
            return res.render('profile', {
            error: error
            }); //end return
          } else {
              return res.render('profile', {
                error: error,
                user: user
              }); //end return
          } //end else
        }) //end exec function
  } //end else
}); //end GET

// GET /register
// router.get('/register',  function(req, res, next){
router.get('/register', mid.loggedOut, function(req, res, next){
  return res.render('register', {
      title: 'Sign Up'
  });
});

// POST /register
router.post('/register', function(req, res, next) {
   var userData = {
       email: req.body.email,
       name: req.body.name,
       password: req.body.password
   };
   if (req.body.password !== req.body.confirmPassword) {
     var error = "Passwords do not match";
     return res.render('register', {
        user: userData,
        title: "Register Here!",
        error: error
      });
   }
       
   // use schema's create method to insert documet into Mongo
   User.create(userData, function (error, user) {
       if (error) {
           res.render("register", {
           user: user,
           error: error
           });
        } else {
          req.session.userId = req.user._id;
          res.render("profile", {
          user: user          
          });
       }
   });
});

//// Twitter Display Functions

function gotAccount(err, data, res, next){  // Used for screen name
  if (err) {
    errorMsg = "twitter-fail"; // This will be caught on app.get route
  }  
  object.account = data;
  return object.account;
}
    
function gotDataTweets(err, data, response){  // Our lists of tweets
  if (err) {
    errorMsg = "twitter-fail"; // This will be caught on app.get route
  } 
  object.tweets = data;   // load tweets to object   
  tweets = object.tweets;
  return object.tweets;
} 

module.exports = router;