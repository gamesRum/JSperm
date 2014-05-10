#!/bin/env node
;(function (module) {
  'use strict';

  var path = './config/',
    env_config = require(path + 'env.json'),
    morgan_config = require(path + 'morgan.json');

  module.exports = {
    env: env_config,
    morgan: morgan_config
  };
}(module || this));