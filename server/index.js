// start websocket server
// start sphinx server

// EXPRESS
var server = require('./src/express/app');

// WEBSOCKETS
var websocketServer = require('./src/express/websocket');
websocketServer.start(server);

// SPHINX
var sphinx = require('./src/sphinx');

console.log('hello');

