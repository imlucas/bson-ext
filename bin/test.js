#!/usr/bin/env node

var runtime = process.version.charAt(0) === '1' ? 'iojs' : 'node';
var child_process = require('child_process');
var path = require('path');

var args = [
  path.resolve(__dirname + '/../node_modules/nodeunit/bin/nodeunit'),
  path.resolve(__dirname + '/../test/node')
];
var p = child_process.spawn(runtime, args);
p.stderr.pipe(process.stderr);
p.stdout.pipe(process.stdout);
p.on('exit', function(code){
  process.exit(code);
});
