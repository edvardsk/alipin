var conf = require('./conf.js');

function log (level, method, prefix, message) {
    if (conf.get('LogLevel') <= level) {
        console[method](prefix + ':\n' + (new Date()) + '\n' + message);
    }
}

module.exports = {
    log: function (message) {
        log(this.LogLevels.Log, 'log', 'Log', message);
    },

    info: function (message) {
        log(this.LogLevels.INFO, 'log', 'Info', message);
    },

    debug: function (message) {
        log(this.LogLevels.DEBUG, 'log', 'Debug', message);
    },

    warn: function (message) {
        log(this.LogLevels.WARN, 'log', 'Warn', message);
    },

    error: function (message) {
        log(this.LogLevels.ERROR, 'log', 'Error', message);
    },

    LogLevels: {
        LOG: 0,
        INFO: 1,
        DEBUG: 2,
        WARN: 3,
        ERROR: 4
    }
};