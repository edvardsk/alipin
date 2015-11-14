var Tail = require('file-tail'),
    logger = require('../util/logger'),
    _ = require('lodash'),
    EventEmitter = require('events').EventEmitter
    conf = require('../util/conf.js');

function Sphinx() {
    this.eventName = 'poketSphinxEvent';
    this.event = new EventEmitter();
    this.tail = Tail.startTailing(conf.get('pocketSphinxFile'));
}

Sphinx.prototype.on = function (successCb, errorCb) {
    var self = this;

    this.event.on(this.eventName, successCb);

    if (!_.isFunction(successCb)) {
        logger.error('PLease, pass callback');
        return;
    }

    this.tail.on('line', function(data) {
        self.event.emit(self.eventName, data);
        logger.log(data);
    });

    if (_.isFunction(errorCb)) {
        this.tail.on('error', function (error) {
            logger.error(error);
        });
    }
};

Sphinx.prototype.record = function () {
    // start pocketsphinx listening
};

Sphinx.prototype.stop = function () {
    // stop pocketsphinx listening
};

var sphinx = new Sphinx();

sphinx.on(function (data) {
    console.log('---');
    console.log(data);
    console.log('---');
});
