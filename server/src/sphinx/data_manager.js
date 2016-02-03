var COMMANDS = require('../util/enum').COMMANDS;

function DataManager() {
    this.handlers = {};

    this.handlers[COMMANDS.HELLO] = function () {
        console.log('hello!!!!!');
    };
}

DataManager.prototype.handleCommand = function (intent) {
    console.log(intent);
    console.log(this.handlers);
};

module.exports = DataManager;