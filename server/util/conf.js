var conf = require('../constants/conf.json');

exports.get = function (key) {
    var result = null;

    if (key in conf) {
        result = conf[key];
    }
    return result;
}

exports.set = function (key, value) {
    conf[key] = value;
}
