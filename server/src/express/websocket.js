var WebSocketServer = require('websocket').server;
var logger = require('../util/logger');

var wsServer;
var connection;

module.exports = {
    start: function (server) {
        // create the server
        wsServer = new WebSocketServer({
            httpServer: server
        });

        // WebSocket server
        wsServer.on('request', function(request) {
            connection = request.accept(null, request.origin);
            logger.log('Websocket server open connection');

            connection.on('close', function(connection) {
                logger.log('Websocket server close connection');
            });
        });
    },

    send: function (type, data) {
        connection.send(JSON.stringify({
            type: type,
            data: data
        }));
    }
};