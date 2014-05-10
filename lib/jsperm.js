#!/bin/env node
;(function (module) {
  'use strict';

  var express = require('express'),
    morgan  = require('morgan'),
    config = require('./config.js'),
    controllers = require('./controllers'),
    app = express();

  app.use(morgan(config.morgan));
  app.use(express.static(__dirname + '/public'));

  app.all('/test', controllers.test_controller); // do not delete this route

  var wrap = app.listen(3000);

  module.exports = {
    start: function () {
      wrap = app.listen(parseInt(config.env.sv_port), config.env.ip_address);
      console.log('JSperm is ejaculating code through ' + config.env.ip_address + ':' + config.env.sv_port);
    },
    close: function () {
      wrap.close();
      console.log('JSperm turned off');
    }
  };
}(module || this));