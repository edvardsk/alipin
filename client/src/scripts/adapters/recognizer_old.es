import _ from 'lodash';

export default class Recognizer {
    constructor({continuous, language, interimResults, commands, autoRestart}) {
        this.recognition = new webkitSpeechRecognition();

        this.recognition.continuous = continuous;
        this.recognition.interimResults = interimResults;
        this.recognition.lang = language;

        this.recognition.onresult = this.onRecognize;
        this.recognition.onerror = this.onError;
        this.recognition.onend = this.onEnd;

        this.autoRestart = autoRestart;
        this.commands = commands; // array: command - regexp, action - method
    }

    setCommands(commands) {
        this.commands = commands;
    }

    onEnd = (event) => {
        console.log('on end');

        if (this.autoRestart) {
            this.restart();
        }
    };

    restart() {
        this.recognition.stop();
        this.recognition.abort();
        setTimeout(() => {
            this.recognition.start();
        }, 2000);
    }

    onError = (event) => {
        console.log('on error');
        // console.error(event);

        if (this.autoRestart) {
        //    this.restart();
        }
    };

    onRecognize = (event) => {
        // console.log(event);

        const result = _.last(event.results);

        _.forEach(result, ({ transcript }) => {
            _.forEach(this.commands, ({ command, action }) => {
                let match = transcript.match(command);
                if (!!match) {
                    action(match);
                }
            });
        });
    };

    start() {
        console.log('start');
        this.recognition.start();
    }

    stop() {
        console.log('stop');
        this.recognition.stop();
        this.recognition.abort();
    }
};