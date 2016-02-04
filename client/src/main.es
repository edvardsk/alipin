import './main.scss';

// INIT WebSocket
var connection = new WebSocket('ws://127.0.0.1:8080');

connection.onopen = function () {
    console.log('onopen connection');
};

connection.onmessage = function (message) {
    // try to decode json (I assume that each message from server is json)
    try {
        var json = JSON.parse(message.data);
    } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        return;
    }
    // handle incoming message
    console.log(json);
};