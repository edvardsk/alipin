import { Deferred } from 'jquery-deferred';
import Constants from '../constants/constants';

export default class Speaker {

    constructor(networkAdapter, audioVisualizator) {
        this.isPlaying = false;
        this.playSound = null;

        this.networkAdapter = networkAdapter;
        this.audioVisualizator = audioVisualizator;
    }

    speak(url) {
        if (!url) {
            throw 'No passed url exception';
        }

        const dfd = new Deferred();

        let context = new window.AudioContext();
        let sound;

        this.networkAdapter.getSound(url).then( (response) => {
            context.decodeAudioData(response, (buffer) => {

                sound = buffer;
                const playSound = context.createBufferSource();
                playSound.buffer = sound;
                playSound.connect(context.destination);

                setTimeout(this.audioVisualizator.renderAudio({
                    source: playSound,
                    context
                }, () => {
                    if (context) {
                        context.close();
                    }
                    context = null;
                }), 0);
                playSound.start(0);
                this.playSound = playSound;
                dfd.resolve();
            });

        });

        return dfd.promise();
    }

    stop() {
        if (this.playSound) {
            this.playSound.stop();
            this.playSound = null;
        } else {
            throw 'No execution exception';
        }
    }

    // COMMANDS
    greeting(options) {
        const dfd = new Deferred();

        if (!options) {
            return dfd.reject().promise();
        }

        this.networkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.GREETING.replace('${name}', options.name)).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }

    parting(options) {
        const dfd = new Deferred();

        if (!options) {
            return dfd.reject().promise();
        }

        this.networkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.PARTING.replace('${name}', options.name)).then((data) => {
             this.speak(data.snd_url).then(() => {
                dfd.resolve();
             });
        });

        return dfd.promise();
    }

    time(options) {
        const dfd = new Deferred();

        if (!options) {
            return dfd.reject().promise();
        }

        this.networkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.TIME
                                                                    .replace('${hours}', options.hours)
                                                                    .replace('${minutes}', options.minutes)).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }

    openWebpage(page) {
        const dfd = new Deferred();

        if (!page) {
            return dfd.reject().promise();
        }

        this.networkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.WEBPAGE.replace('${page}', page)).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }

    closeWebpage() {
        const dfd = new Deferred();
        
        this.networkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.CLOSE_WEBPAGE).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }

    playAudio(fileName) {
        this.isPlaying = true;
        this.speak(fileName);
    }

    stopPlayAudio() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.stop();
        }
        return (new Deferred()).resolve().promise();
    }

    showTweets() {
        this.networkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.SHOW_TWEETS).then((data) => {
            this.speak(data.snd_url);
        });

        return (new Deferred()).resolve().promise();
    }

    openFile(fileName) {
        const dfd = new Deferred();

        if (!fileName) {
            return dfd.reject().promise();
        }

        this.networkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.OPEN_FILE.replace('${fileName}', fileName)).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }

    closeFile() {
        const dfd = new Deferred();
        
        this.networkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.CLOSE_FILE).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }
}
