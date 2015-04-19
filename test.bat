call node --version
call npm --version
set BASE=%cd%
SET PATH=%PATH%;%BASE%\node_modules\.bin;%APPDATA%\npm
SET PATH=%PATH%;C:\Program Files (x86)\Git\bin
call npm install https://github.com/mongodb-js/node-pre-gyp/archive/v0.6.5-appveyor.tar.gz
call npm install https://github.com/mongodb-js/node-gyp/archive/v1.04-appveyor.tar.gz
call npm install --build-from-source --msvs=2013
call npm test
