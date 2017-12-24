'use strict';

var express = require('express'),
    router = express.Router(),
    Therapy = require('../models/therapy.js'),
    Twit       = require('twit'),
    config     = require('../src/config'),     // Object literal containing Twitter                                      //API access key and token
    moment = require('moment'),
    mid = require('../middleware');

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

/* Create a Remove Therapy form. */
router.get("/:id/remove", function(req, res, next){
  Therapy.findById(req.params.id).then(function(therapy){
    if(therapy) {
      res.render('therapies/remove', {
        therapy: therapy,
        title: "Remove Therapy"
      });
    } else {
      res.send(404);
    }
  });
});

// Get New Therapy form
router.get('/new', function(req, res, next){
  res.render("therapies/new", {
    title: "New Therapy"
  });
});

/* Create an Edit therapy form. */
router.get('/:id/edit', function(req, res, next) {
  Therapy.findById(req.params.id).then(function(therapy){
    res.render("therapies/edit", {
      therapy: therapy
    });
  });
});

/* Edit Therapy With a Put */
router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  var therapy = req.body;
  Therapy.findByIdAndUpdate(id, therapy, function(err, therapy) {
    if(err) {
      return res.status(500).json({err: err.message });
    } 
    res.redirect("/therapies/" + therapy.id + "/edit");
    // res.json({'therapy': therapy, message: 'Therapy Updated'}); 
  });
});

// POST /api/ 201
// Creates a therapy, sets the Location header to "/", and returns no content */
router.post('/', function(req, res, next) {
  var userData = {
     therName: req.body.therName,
     therStreet: req.body.therStreet,
     therCity: req.body.therCity,
     therState: req.body.therState,
     therImage1: req.body.therImage1,
     therImage2: req.body.therImage2,
     therImage3: req.body.therImage3,
     therSv1: req.body.therSvc1,
     therSv2: req.body.therSvc2,
     therSv3: req.body.therSvc3,
     therAbout: req.body.therAbout,
     therDeals: req.body.therDeals
  };
  // use schema's create method to insert documet into Mongo
  Therapy.create(userData, function(error, therapy) {
    if(error) {
      res.render("therapies/new", {
        therapy: therapy,
        title: "New Therapy",
        error: error
      });
      // return res.status(500).json({error: error.message });
    }else {
       res.redirect('/therapies/' + therapy.id + '/edit');
    }
  });
});
         

// Get therapy list
router.get('/list', function(req, res, next){
  Therapy.find({})
    .exec(function(error, therapies){
      if(error) {
        res.render("therapies/list", {
          therapies: therapies,
          error: error
          });
      }
      res.render("therapies/list", {
        therapies: therapies,
        title: "Therapies" 
      });
    });
});

router.delete('/:id', function(req, res) {
  var id = req.params.id;
  Therapy.findByIdAndRemove(id, function(err,result) {
    if (err) {
      return res.status(500).json({ err: err.message });
    }
    res.redirect('/therapies/list');
    // res.json({ message: 'Therapy Deleted' });
  });
});

/* GET Therapy Details Page */
router.get('/:id/details', function(req, res, next) {
  Therapy.findById(req.params.id).then(function(therapy){
    if(therapy.therSvc1 > ''){
      services.push(therapy.therSvc1);
    }
    if(therapy.therSvc2 > ''){
      services.push(therapy.therSvc2);
    }
    if(therapy.therSvc3 > ''){
      services.push(therapy.therSvc3);
    }
    
    var account = T.get('account/settings', params, gotAccount) //This retrieves hd screenname
    .then(function(account){
      var tweets = T.get('statuses/user_timeline', params, gotDataTweets)
      .then(function(tweets){
        res.render("therapies/details", {
          therapy: therapy,
          services: services,
          account: account.data,
          tweets: tweets.data,
          title: "Therapy Details"
        }); // end render function
      }); // end then
    }); // end then
  });  // end Therapy.findById
}); // end router get id/details

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
