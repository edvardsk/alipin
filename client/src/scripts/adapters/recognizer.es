export default class Recognizer {
    constructor({ lang }) {
        this.annyang = annyang;
        this.annyang.init({});
        this.annyang.setLanguage(lang);
    }

    setLanguage(lang) {
        this.annyang.setLanguage(lang);
    }

    setCommands(commands) {
        this.annyang.removeCommands();
        this.annyang.addCommands(commands);
    }

    start(options={}) {
        this.annyang.start(options);
    }

    stop() {
        this.annyang.abort();
    }
}