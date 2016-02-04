var COMMANDS = require('../util/enum').COMMANDS;
var logger = require('../util/logger');

var helloService = require('./services/hello');
var timeService = require('./services/time');
var twitterService = require('./services/twitter');
var minskService = require('./services/forecast_minsk');
var vitebskService = require('./services/forecast_vitebsk');

var websocket = require('../express/websocket');

function DataManager() {
    this.handlers = {};

    this.handlers[COMMANDS.HELLO] = helloService;
    this.handlers[COMMANDS.TIME] = timeService;
    this.handlers[COMMANDS.TWITS] = twitterService;
    this.handlers[COMMANDS.WEATHER_MINSK] = minskService;
    this.handlers[COMMANDS.WEATHER_VITEBSK] = vitebskService;
}

DataManager.prototype.handleCommand = function (intent) {
    if (!this.handlers[intent]) {
        logger.error('Unexpected intent: ' + intent);
        return;
    }

    this.handlers[intent].exec(function (data) {
        websocket.send(intent, data);
    });
};

// var dataManager = new DataManager();

// // dataManager.handleCommand('in_hello');
// // dataManager.handleCommand('in_time');
// // dataManager.handleCommand('in_twits');
// dataManager.handleCommand('in_weather_minsk');
// dataManager.handleCommand('in_weather_vitebsk');


module.exports = DataManager;