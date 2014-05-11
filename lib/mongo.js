#!/bin/env node
;(function (module) {
  'use strict';

  var mongo = require('mongodb');

  var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

  var server = new Server('localhost', 27017, { w: 1, auto_reconnect: true });
  var db = new Db('jsperm', server);

  db.open(function(err, db) {
      if(!err) {
          console.log("Connected to 'winedb' database");
          db.collection('codes', {strict:true}, function (err, collection) {
              if (err) {
                  console.log("The 'codes' collection doesn't exist. Creating it with sample data...");
                  populateDB();
                collection = collection || {};
              }
          });
      }
  });

  module.exports = {
    db: db,
    BSON: BSON
  };

  /*--------------------------------------------------------------------------------------------------------------------*/
  // Populate database with sample data -- Only used once: the first time the application is started.
  // You'd typically not find this code in a real-life app, since the database would already exist.
  var populateDB = function() {

      var codes = [
      {
          name: "Hello World!",
          description: "",
          script: "OyhmdW5jdGlvbiAoYm94KSB7DQogICd1c2Ugc3RyaWN0JzsNCg0KICBib3guZ3JlZXRlciA9IGZ1bmN0aW9uIChuYW1lKSB7DQogICAgYm94LmNvbnNvbGUubG9nKCdIZWxsbyAnICsgbmFtZSk7DQogIH07DQp9KHdpbmRvdyB8fCBleHBvcnQgfHwgdGhpcykpOw==",
          comments: [
            {
              user: "test",
              line: 1,
              content: "Why semicolon?",
              responses: [
                {
                  user: "troll",
                  content: "because f*ck you!"
                },
                {
                  user: "test",
                  content: "do not feed the troll"
                }
              ]
            },
            {
              user: "test",
              line: 7,
              content: "I prefer to use only this instead of window or export"
            }
          ]
      },
      {
          name: "sum",
          description: "Summarize all given numbers :)",
          script: "OyhmdW5jdGlvbiAoYm94KSB7DQogICd1c2Ugc3RyaWN0JzsNCg0KICBib3guc3VtID0gZnVuY3Rpb24gKCkgew0KICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLA0KICAgICAgc3VtID0gMCwNCiAgICAgIGF1eDsNCg0KICAgIGlmIChsZW5ndGggPT09IDApIHsNCiAgICAgIHJldHVybiBzdW07DQogICAgfQ0KDQogICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkgew0KICAgICAgYXV4ID0gcGFyc2VJbnQoYXJndW1lbnRzW2ldLCAxMCk7DQogICAgICBpZiAoaXNOYU4oYXV4KSkgew0KICAgICAgICBjb25zb2xlLmVycm9yKCdOb3QgYSBudW1iZXInKTsNCiAgICAgICAgcmV0dXJuOw0KICAgICAgfQ0KICAgICAgc3VtICs9IGF1eDsNCiAgICB9DQoNCiAgICByZXR1cm4gc3VtOw0KICB9Ow0KfSh3aW5kb3cpKTs="
      }];

      db.collection('codes', function(err, collection) {
          collection.insert(codes, {safe:true}, function(err, result) {
            err = err || {};
            result = result || {};
          });
      });

  };
}(module || this));