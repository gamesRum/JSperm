#!/bin/env node
;(function () {
  'use strict';

  var server = require('./lib/jsperm.js');
    // readline = require('readline'),
    // rl = readline.createInterface(process.stdin, process.stdout);

  server.start();

  // rl.setPrompt('jsperm> ');
  // rl.prompt();
  // rl.on('line', function (line) {
  //   switch (line) {
  //     case 'help':
  //       console.log('not yet');
  //     break;
  //     case 'restart':
  //       server.restart();
  //     break;
  //     case 'close':
  //       rl.close();
  //     break;
  //     default:
  //       if (line) {
  //         console.log('command not found: ' + line);
  //       }
  //     break;
  //   }
  //   rl.prompt();
  // }).on('close', function () {
  //   server.close();
  //   process.exit(0);
  // });
}());