#!/bin/env node
;(function (module) {
  'use strict';

  var
    /* Very Important Stuff */
    express = require('express'),
    morgan  = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
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
    use(bodyParser()).
    use(session(config.session)).
    use(passport.initialize()).
    use(passport.session());

  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

  require('./auth.js')(app, config, passport); // All auth stuff goes there

  app.get('/account', isAuthenticated, function(req, res) {
    res.send({ user: req.user });
  });

  app.all('/tw', function (req, res) {
    console.log(req.user);
    res.send('tw...');
  });

  app.all('/test', routes.test); // never delete this route

  app.get('/api/codes', routes.codes.findAll);
  app.get('/api/codes/:id', routes.codes.findById);
  app.post('/api/codes/', routes.codes.addCode);
  app.put('/api/codes/:id', routes.codes.updateCode);
  app.delete('/api/codes/:id', routes.codes.deleteCode);

  app.get('*', function(req, res){
    res.status(404);
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
    } else {
      res.type('txt').send('Not found');
    }
  });

  module.exports = {
    start: function () {
      appWrapper = app.listen(parseInt(config.env.sv_port), config.env.ip_address);
      console.log('JSperm is ejaculating code through ' + config.env.ip_address + ':' + config.env.sv_port);
    },
    close: function () {
      appWrapper.close();
      console.log('JSperm turned off');
    },
    restart: function () {
      console.log('JSperm is restarting...');
      appWrapper.close();
      this.start();
    }
  };
}(module || this));