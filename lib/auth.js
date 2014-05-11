#!/bin/env node
;(function (module) {
  'use strict';

  module.exports = function (app, config, passport) {
    var TwitterStrategy = require('passport-twitter').Strategy;

    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });

    passport.use(new TwitterStrategy(config.auth_twitter,
      function(token, tokenSecret, profile, done) {
        done(null, profile);
        // This supposes to looking for the user on database, e.g.
        // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
        //   return done(err, user);
        // });
      }
    ));

    app.get('/auth/twitter',
      passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
      passport.authenticate('twitter', { failureRedirect: '/' }),
      function(req, res) {
        // Successful authentication, redirect home.
        // console.log(req.user);
        res.redirect('/tw');
      });
  };
}(module || this));