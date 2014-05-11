#!/bin/env node
/*
 * Codes route
 */
;(function (module) {
  'use strict';

  var mongo = require('./../mongo.js'),
    db = mongo.db,
    BSON = mongo.BSON;

  module.exports.findById = function(req, res) {
      var id = req.params.id;
      console.log('Retrieving wine: ' + id);
      db.collection('codes', function(err, collection) {
          collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
              res.send(item);
          });
      });
  };

  module.exports.findAll = function(req, res) {
      db.collection('codes', function(err, collection) {
          collection.find().toArray(function(err, items) {
              res.send(items);
          });
      });
  };

  module.exports.addWine = function(req, res) {
      var wine = req.body;
      console.log('Adding wine: ' + JSON.stringify(wine));
      db.collection('codes', function(err, collection) {
          collection.insert(wine, {safe:true}, function(err, result) {
              if (err) {
                  res.send({'error':'An error has occurred'});
              } else {
                  console.log('Success: ' + JSON.stringify(result[0]));
                  res.send(result[0]);
              }
          });
      });
  };

  module.exports.updateWine = function(req, res) {
      var id = req.params.id;
      var wine = req.body;
      console.log('Updating wine: ' + id);
      console.log(JSON.stringify(wine));
      db.collection('codes', function(err, collection) {
          collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
              if (err) {
                  console.log('Error updating wine: ' + err);
                  res.send({'error':'An error has occurred'});
              } else {
                  console.log('' + result + ' document(s) updated');
                  res.send(wine);
              }
          });
      });
  };

  module.exports.deleteWine = function(req, res) {
      var id = req.params.id;
      console.log('Deleting wine: ' + id);
      db.collection('codes', function(err, collection) {
          collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
              if (err) {
                  res.send({'error':'An error has occurred - ' + err});
              } else {
                  console.log('' + result + ' document(s) deleted');
                  res.send(req.body);
              }
          });
      });
  };
}(module || this));