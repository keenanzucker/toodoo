var path = require('path');
var express = require('express');
var Noot = require('../models/nootModel');

var routes = {};

routes.home = function(req, res){
  Noot.find().sort({time:-1}).exec(function(err, noots){
    if (err) console.log(err);
    else {
      res.render('index', {noots:noots});
      console.log("Showing da Noots!");
    }
  });
}

routes.newNoot = function(req, res){

  console.log(req.body.text);
  text = req.body.text;
  author = req.body.author;

  var noot = new Noot({
    text: text,
  });
  console.log(noot);
  
  noot.save(function(err, val){
    if (err) console.log(err);
    else{
      console.log("New Noot: " + req.body.text);
      res.send(val);
    }
  });
}

routes.remove = function(req, res){
  console.log(req.body.idToDelete);
  Noot.findOne({'_id':req.body.idToDelete}).remove(function(err, val){
    if (err) console.log(err);
    else{
      console.log("Noot with id " + req.body.idToDelete + " deleted.");
      res.send(val);
    }
  });
}




// routes.feed = function(req, res){

//   console.log('FROM THE SERVER: ', req.user);

//   Twote.find().sort({time:-1}).exec(function(err, twotes){
//     if (err) console.log(err);
//     else {
//       User.find().sort({time:-1}).exec(function(err, users){
//         if (err) console.log(err)
//         else {
//           res.render('index', {twotes: twotes, users: users, currentUser: req.user});
//           console.log("Showing Twotes and Users!");
//           console.log(req.user);
//         }
//       });
//     }
//   });
// }

// routes.highlight =function(req, res){

//   clickId = req.body.id;

//   User.findById(clickId, function(err, found){
//     if (err) console.log(err);
//     else {

//       console.log('YOU CLICKED ON', found.username);
//       res.send(found);
//     }
//   });
// }







module.exports = routes;