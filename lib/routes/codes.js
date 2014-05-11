#!/bin/env node
/*
 * Handlers for /codes routes
 */
;(function (module) {
  'use strict';

  var mongo = require('./../mongo.js'),
    db = mongo.db,
    BSON = mongo.BSON;

  module.exports.findById = function(req, res) {
      var id = req.params.id;
      console.log('Retrieving code: ' + id);
      db.collection('codes', function (err, collection) {
          collection.findOne({ '_id':new BSON.ObjectID(id) }, function (err, item) {
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

  module.exports.addCode = function(req, res) {
      var code = req.body;
      console.log('Adding code: ' + JSON.stringify(code));
      db.collection('codes', function(err, collection) {
          collection.insert(code, {safe:true}, function(err, result) {
              if (err) {
                  res.send({'error':'An error has occurred'});
              } else {
                  console.log('Success: ' + JSON.stringify(result[0]));
                  res.send(result[0]);
              }
          });
      });
  };

  module.exports.updateCode = function(req, res) {
      var id = req.params.id;
      var code = req.body;
      console.log('Updating code: ' + id);
      console.log(JSON.stringify(code));
      db.collection('codes', function(err, collection) {
          collection.update({'_id': new BSON.ObjectID(id)}, code, {safe:true}, function (err, result) {
              if (err) {
                  console.log('Error updating code: ' + err);
                  res.send({'error':'An error has occurred'});
              } else {
                  console.log('' + result + ' document(s) updated');
                  res.send(code);
              }
          });
      });
  };

  module.exports.deleteCode = function(req, res) {
      var id = req.params.id;
      console.log('Deleting code: ' + id);
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