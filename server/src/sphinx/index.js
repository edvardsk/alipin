var _ = require('lodash');

var Sphinx = require('./adapters/sphinx');
var Witai = require('./adapters/witai');
var DataManager = require('./data_manager');

var sphinx = new Sphinx();
var witai = new Witai();
var dataManager = new DataManager();

var handler = _.bind(dataManager.handleCommand, dataManager);

sphinx.on(function (maybeCommand) {
    console.log('---');
    console.log(maybeCommand);
    console.log('===');
    witai.capture(maybeCommand, handler);
}).record();
