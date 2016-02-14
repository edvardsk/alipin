var express = require('express');
var path = require('path');

var logger = require('../util/logger');
var conf = require('../util/conf');

var app = express();
var server;

app.use('/build', express.static(path.join(__dirname, '../../client/build')));
app.use('/source', express.static(path.join(__dirname, '../../client/source')));
// app.use('/modules', express.static(path.join(__dirname, '../../node_modules')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
});

module.exports = function (cb) {
    server = app.listen(conf.get('EXPRESS_PORT'), conf.get('EXPRESS_HOST'), function () {
        logger.info('App listening at http://' + server.address().address + ':' + server.address().port);
        cb(server);
    });
}
