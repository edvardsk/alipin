var CronJob = require('cron').CronJob;
var child = require('child_process');
var clc = require('cli-color');

// function, that call test execution and out to terminal test results
function test(successCb, errrorCb) {
    child.spawn('npm', ['test'], { stdio:'inherit' })
        .on('exit', function (error) {
            if (!error) {
                successCb();
            } else {
                errrorCb(error);
            }
        });
}


// '* * * * * *' - runs every second
// '*/5 * * * * *' - runs every 5 seconds
// '10,20,30 * * * * *' - run at 10th, 20th and 30th second of every minute
// '0 0 * * * *' - runs every hour (at 0 minutes and 0 seconds)
var pattern = process.argv[2] || '0 * * * * *'; // every minute

var job = new CronJob(pattern, function() {

    console.log(clc.blue('\nSTART OF TEST EXECUTION: ' + (new Date())) + '\n');
    test(function () {
        console.log(clc.blue('\nSUCCESS END OF TEST EXECUTION: ' + (new Date())) + '\n');
    }, function (error) {
        console.error(clc.red('\nERROR END OF TEST EXECUTION: ' + (new Date())) + '\n');
        console.error(error);
    });

}, null, true);
