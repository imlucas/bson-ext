#!/usr/bin/env bash

export GYP_MSVS_VERSION=2013
npm install -g mongodb-js/node-gyp
npm install --build-from-source
