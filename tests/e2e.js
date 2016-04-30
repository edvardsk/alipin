var jsdom = require('mocha-jsdom');
var clc = require('cli-color');

describe(clc.green('INTEGRATION TESTS:'), function () {
    jsdom({
        globalize: true,
        console: true,
        useEach: true,
        skipWindowCheck: true,
        html: "<!doctype html><html><head><meta charset='utf-8'></head>" +
        '<body></body></html>'
    });

    require('./build/e2e.bundle.js');
});