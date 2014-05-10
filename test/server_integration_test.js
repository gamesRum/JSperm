'use strict';

var expect = require("chai").expect,
  http = require('http'),
  server;

before(function () {
  server = require('../lib/jsperm.js');
  server.start();
});

after(function () {
  server.close();
});

describe('server', function() {
  describe('should return 200', function() {
    var options = {
      hostname: 'localhost',
      port: 8080,
      path: '/test'
    };

    it('with get', function (done) {
      options.method = 'GET';
      var req = http.request(options, function (res) {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
      req.end();
    });

    it('with post', function (done) {
      options.method = 'POST';
      var req = http.request(options, function (res) {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
      req.end();
    });

    it('with put', function (done) {
      options.method = 'PUT';
      var req = http.request(options, function (res) {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
      req.end();
    });

    it('with delete', function (done) {
      options.method = 'DELETE';
      var req = http.request(options, function (res) {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
      req.end();
    });
  });
});
