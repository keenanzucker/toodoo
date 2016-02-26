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

routes.toggle = function(req, res){

  console.log(req.body.idToToggle);

  Noot.findOne({_id: req.body.idToToggle}, function(err, val){
    if (val.done === true){
      Noot.findByIdAndUpdate(req.body.idToToggle, {done:false}, function(err, val){
       if (err) console.log(err);
        else {
          console.log("Noot with id: " + req.body.idToToggle + " toggled False!");
          res.json(val);
        }
      })
    } else {
      Noot.findByIdAndUpdate(req.body.idToToggle, {done:true}, function(err, val){
       if (err) console.log(err);
        else {
          console.log("Noot with id: " + req.body.idToToggle + " toggled True!");
          res.json(val);
        }
      })
    }
  });
}

routes.edit = function(req, res){

  console.log("EDIT: " + req.body.newText + " of " + req.body.idToEdit);

  Noot.findByIdAndUpdate(req.body.idToEdit, {text: req.body.newText}, function(err, val){
    if (err) console.log(err);
    else {
      console.log("EDITTED!");
      res.json(val);
    }
  })

}

module.exports = routes;