// var rec       = require('node-record-lpcm16'),
//     request   = require('request');
 
// var witToken = process.env.WIT_TOKEN; // get one from wit.ai! 
 
// parseResult = function (err, resp, body) {
//     console.log(arguments);
// };
 
// rec.start().pipe(request.post({
//     'url'     : 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
//     'headers' : {
//         'Accept'        : 'application/vnd.wit.20160202+json',
//         'Authorization' : 'Bearer ' + witToken,
//         'Content-Type'  : 'audio/wav'
//     }
// }, parseResult));

// var record = require('node-record-lpcm16'),
//     fs     = require('fs');
 
// var file = fs.createWriteStream('../../audio/test.wav', { encoding: 'binary' });
 
// record.start({
//   sampleRate : 44100,
//   verbose : true
// })
// .pipe(file);