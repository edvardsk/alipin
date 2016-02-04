var Forecast = require('forecast');

var logger = require('../../util/logger');
var conf = require('../../util/conf');

var forecast = new Forecast({
    service: 'forecast.io',
    key: conf.get('FORECAST_API_KEY'),
    units: 'celcius'    // Only the first letter is parsed
});

module.exports = function (coordinates, successCb) {
    forecast.get(coordinates, function (err, weather) {
        if (err) {
            logger.error(err);
        }

        successCb(weather);
    });
}