#!/bin/env node
;(function (module) {
  'use strict';

  var
    /* Very Important Stuff */
    express = require('express'),
    morgan  = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    /* Auth */
    passport = require('passport'),
    /* Framework scripts */
    utils = require('./utils.js'),
    config = utils.loadFilesFrom('config'),
    routes = utils.loadFilesFrom('routes'),
    /* The app and its wrapper */
    app = express(),
    appWrapper;

  app.
    use(morgan(config.morgan)).
    use(express.static(__dirname + './../public')).
    use(cookieParser()).
    // body-parser supposed to be here
    use(session(config.session)).
    use(passport.initialize()).
    use(passport.session());

  require('./auth.js')(app, config, passport); // All auth stuff goes there

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }

  app.get('/account', ensureAuthenticated, function(req, res) {
    res.send({ user: req.user });
  });

  app.all('/tw', function (req, res) {
    console.log(req.user);
    res.send('tw...');
  });

  app.all('/test', routes.test); // do not delete this route

  app.get('/codes', routes.codes.findAll);
  app.get('/codes/:id', routes.codes.findById);

  module.exports = {
    start: function () {
      appWrapper = app.listen(parseInt(config.env.sv_port), config.env.ip_address);
      console.log('JSperm is ejaculating code through ' + config.env.ip_address + ':' + config.env.sv_port);
    },
    close: function () {
      appWrapper.close();
      console.log('JSperm turned off');
    }
  };
}(module || this));