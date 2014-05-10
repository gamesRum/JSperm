#!/bin/env node
;(function (module) {
  'use strict';

  module.exports = function (req, res) {
    res.send('Test...');
  };
}(module || this));