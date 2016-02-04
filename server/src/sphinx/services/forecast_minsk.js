var conf = require('../../util/conf');
var forecast = require('./forecast_base');

module.exports = {
    exec: function (successCb) {
        forecast(conf.get('FORECAST_MINSK_COORDINATES'), successCb);
    }
};