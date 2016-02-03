var conf = require('./conf.js');

function logMessage (level, method, prefix, message) {
    if (conf.get('LOG_LEVEL') <= level) {
        console[method](prefix + ':\n' + (new Date()) + '\n' + message);
    }
}

module.exports = {
    log: function (message) {
        logMessage(this.LogLevels.LOG, 'log', 'Log', message);
    },

    info: function (message) {
        logMessage(this.LogLevels.INFO, 'info', 'Info', message);
    },

    debug: function (message) {
        logMessage(this.LogLevels.DEBUG, 'log', 'Debug', message);
    },

    warn: function (message) {
        logMessage(this.LogLevels.WARN, 'warn', 'Warn', message);
    },

    error: function (message) {
        logMessage(this.LogLevels.ERROR, 'error', 'Error', message);
    },

    LogLevels: {
        LOG: 0,
        INFO: 1,
        DEBUG: 2,
        WARN: 3,
        ERROR: 4
    }
};