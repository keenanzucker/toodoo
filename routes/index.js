var path = require('path');
var express = require('express');
var Noot = require('../models/nootModel');

var routes = {};

routes.home = function(req, res){
  res.render('index', {});
}

routes.showNoots = function(req, res){

  Noot.find().exec(function(err, noots){
    if (err) console.log(err);
    else {
      res.json(noots);
    }
  });
}

routes.newNoot = function(req, res){

  text = req.body.text;

  var noot = new Noot({
    text: text,
    done: false
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

  console.log(req.body);

  Noot.findByIdAndRemove(req.body.idToRemove, function(err, val){
    if (err) console.log(err);
    else{
      console.log("Noot with id " + req.body.idToRemove + " deleted.");
      res.json(val);
    }
  });
}

module.exports = routes;