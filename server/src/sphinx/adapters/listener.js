var path = require("path");

var exec = require('child_process').exec;

var conf = require('../../util/conf.js');

(function () {
    var dictPath = path.join(__dirname, '../' + conf.get('SPHINX_CONFIG_FOLDER'), 'dictionary.dic');
    var acousticModelPath = path.join(__dirname, '../' + conf.get('SPHINX_CONFIG_FOLDER'), 'model.lm');
    var outFilePath = path.join(__dirname, '../' + conf.get('SPHINX_CONFIG_FOLDER'), conf.get('SPHINX_OUTPUT'));
    var command = conf.get('SPHINX_BASE_COMMAND') + '-dict ' + dictPath + ' -lm ' + acousticModelPath + ' > ' + outFilePath;

    var child = exec(command, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
})();