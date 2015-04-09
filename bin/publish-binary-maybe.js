#!/usr/bin/env node

var path = require('path');
var exec = require('child_process').exec;

process.env.node_pre_gyp_bucket = 'mongodb-dx-public';
process.env.PATH = path.resolve(__dirname + '/../node_modules/.bin') + ':' + process.env.PATH;


var state = {};

function isAlreadyPublished(fn){
  exec('node-pre-gyp reveal --loglevel=http', function(err, stdout, stderr){
    if(err) return fn(err);
    state = JSON.parse(stdout);

    exec('node-pre-gyp info --loglevel=http', function(err, stdout){
      if(err) return fn(err);

      var published = false;
      stdout.toString('utf-8').split('\n').map(function(p){
        if(p.indexOf(state.package_name) > -1){
          published = true;
        }
      });
      return fn(null, published);
    });
  });
}

function publish(fn){
  exec('node-pre-gyp rebuild package publish', function(err, stdout){
    if(err) return fn(err);
    fn();
  });
}

isAlreadyPublished(function(err, published){
  if(err){
    console.error(err);
    return process.exit(1);
  }

  if(published){
    console.log('Already published %s', state.package_name);
    return process.exit(0);
  }


  publish(function(err){
    if(err){
      console.error(err);
      return process.exit(1);
    }

    console.log('published binary: %s', state.hosted_tarball);
    process.exit(0);
  })
});
