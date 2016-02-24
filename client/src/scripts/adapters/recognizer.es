import _ from 'lodash';

export default class Recognizer {
    constructor({continuous, language, interimResults, commands, autoRestart}) {
        this.recognition = new webkitSpeechRecognition();

        this.recognition.continuous = continuous;
        this.recognition.interimResults = interimResults;
        this.recognition.lang = language;

        this.recognition.onresult = this.onRecognize;
        this.recognition.onerror = this.onError;
        this.autoRestart = autoRestart;

        this.commands = commands; // array: command - regexp, action - method
    }

    onRecognize = (event) => {
        const result = _.last(event.results);

        if (!result.isFinal) { return; }

        _.forEach(result, ({ transcript }) => {
            _.forEach(this.commands, ({ command, action }) => {
                let match = transcript.match(command);
                if (!!match) {
                    action(match);
                }
            });
        });
    };

    onError = (event) => {
        console.error(event);

        if (this.autoRestart) {
            this.stop();
            this.start();
        }
    };

    start() {
        this.recognition.start();
    }

    stop() {
        this.recognition.stop();
    }
};