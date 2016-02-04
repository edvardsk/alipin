var conf = require('../../util/conf');

module.exports = {
    exec: function (successCb) {
        successCb({
            message: 'Hello, ' + conf.get('USER_NAME')
        });
    }
};