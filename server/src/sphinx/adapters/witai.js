var wit = require('node-wit');
var _ = require('lodash');

var conf = require('../../util/conf');
var logger = require('../../util/logger');

function Witai() {
    this.ACCESS_TOKEN = conf.get('WIT_ACCESS_TOKEN');
    this.confidence = conf.get('CONFIDENCE');
}

Witai.prototype.capture = function (maybeCommand, successCb) {
    var self = this;

    if (!_.isFunction(successCb)) {
        logger.error('Where is callback?');
        return;
    }

    wit.captureTextIntent(this.ACCESS_TOKEN, maybeCommand, function (err, res) {
        var outcomes = res.outcomes[0];

        if (err) {
            logger.error('Error: ', err);
        }

        if (outcomes.confidence >= self.confidence) {
            successCb(outcomes.intent);
        }
    });
};

module.exports = Witai;
