#!/bin/env node
;(function (module) {
  'use strict';

  var fs = require('fs');

  module.exports = {
    loadFilesFrom: function (path, carrier) {
      if (typeof path !== 'string') {
        return;
      }
      carrier = carrier || {};
      if (path[0] !== '/') {
        path = '/' + path;
      }
      path = __dirname + path;
      fs.readdirSync(path).forEach(function (file) {
        if (file !== 'index.js') {
          var moduleName = file.substr(0, file.indexOf('.'));
          carrier[moduleName] = require(path + '/' + moduleName);
        }
      });
      return carrier;
    }
  };
}(module || this));