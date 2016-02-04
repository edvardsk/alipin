var COMMANDS = require('../util/enum').COMMANDS;

function DataManager() {
    this.handlers = {};

    this.handlers[COMMANDS.HELLO] = 
}

DataManager.prototype.handleCommand = function (intent) {
    console.log(intent);
};

module.exports = DataManager;