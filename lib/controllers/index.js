#!/bin/env node
;(function (module) {
  'use strict';

  var fs = require('fs');

  fs.readdirSync(__dirname).forEach(function(file) {
    if (file !== 'index.js') {
      var moduleName = file.substr(0, file.indexOf('.'));
      module.exports[moduleName] = require('./' + moduleName);
    }
  });
}(module || this));