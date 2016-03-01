var express = require('express');
var path = require('path');

var logger = require('../util/logger');
var conf = require('../util/conf');
var loadTweets = require('../services/tweets');

var app = express();
var server;

app.use('/build', express.static(path.join(__dirname, '../../client/build')));
app.use('/source', express.static(path.join(__dirname, '../../client/source')));
app.use('/media', express.static(path.join(__dirname, '../../client/media')));
app.use('/components', express.static(path.join(__dirname, '../../bower_components')));
// app.use('/modules', express.static(path.join(__dirname, '../../node_modules')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
});

app.get('/tweets', function (req, res) {
    loadTweets(function (tweets) {
        res.send(tweets);
    });
});

module.exports = function (cb) {
    server = app.listen(conf.get('EXPRESS_PORT'), conf.get('EXPRESS_HOST'), function () {
        logger.info('App listening at http://' + server.address().address + ':' + server.address().port);
        cb(server);
    });
}
