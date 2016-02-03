var Tail = require('file-tail');
var _ = require('lodash');
var path = require("path");

var logger = require('../../util/logger');
var conf = require('../../util/conf');

var EventEmitter = require('events').EventEmitter;
var fork = require('child_process').fork;

function Sphinx() {
    this.eventName = 'poketSphinxEvent';
    this.event = new EventEmitter();
    this.tail = Tail.startTailing(path.join(__dirname, '../' + conf.get('SPHINX_CONFIG_FOLDER'), conf.get('SPHINX_OUTPUT')));
}

Sphinx.prototype.on = function (successCb) {
    var self = this;

    if (!_.isFunction(successCb)) {
        logger.error('Please, pass callback');
        return;
    }

    this.event.on(this.eventName, successCb);

    this.tail.on('line', function(data) {
        if (data !== '') {
            self.event.emit(self.eventName, data);
        }
    });

    this.tail.on('error', function (error) {
        logger.error(error);
    });

    return this;
};

Sphinx.prototype.record = function () {
    // start listening

    if (!this.child) {
        this.child = fork(path.join(__dirname, './listener.js'));
        logger.log('Start listening');
    } else {
        logger.error('You can not start recording twice');
    }

    return this;
};

Sphinx.prototype.stop = function () {
    // stop listening

    this.child.kill();
    this.child = null;

    return this;
};

module.exports = Sphinx;
