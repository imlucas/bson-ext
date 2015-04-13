#!/usr/bin/env node

var path = require('path');
var exec = require('child_process').exec;
var which = require('which');

process.env.node_pre_gyp_bucket = 'mongodb-dx-public';
process.env.PATH = path.resolve(__dirname + '/../node_modules/.bin') + ':' + process.env.PATH;

var BIN = path.resolve(__dirname, '../node_modules/.bin/node-pre-gyp');

var run = function(args, done) {
  if (typeof args === 'function') {
    done = args;
    args = '';
  }

  var cmd = BIN + ' ' + args;

  exec(cmd, function(err, stdout, stderr) {
    console.log('result of `%s`', cmd, JSON.stringify({
      stdout: stdout.toString('utf-8'),
      stderr: stderr.toString('utf-8')
    }, null, 2));

    if (err) {
      console.error('exec failed: ', err);
      // use setTimeout to get around appveyor missing writes to stderr/stdout
      // and just giving the stupefying "build error" message.
      return setTimeout(function(){
        done(err);
      }, 500);
    }
    done(null, stdout);
  });

};

function isAlreadyPublished(fn){
  run('reveal --loglevel=http', function(err, stdout){
    if(err) return fn(err);

    state = JSON.parse(stdout);

    run('info --loglevel=http', function(err, stdout){
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
  run('rebuild package publish', function(err, stdout){
    if(err) return fn(err);
    fn();
  });
}

function abort(err){
  console.error(err);
  setTimeout(function(){
    return process.exit(1);
  }, 500);
}

isAlreadyPublished(function(err, published){
  if(err) return abort(err);

  if(published){
    console.log('Already published %s', state.package_name);
    return process.exit(0);
  }


  publish(function(err){
    if(err) return abort(err);

    console.log('published binary: %s', state.hosted_tarball);
    setTimeout(function(){
      process.exit(0);
    }, 500);
  });
});
