import { Deferred } from 'jquery-deferred';
import NetworkAdapter from './network_adapter';
import Constants from '../constants/constants';
import AudioVisualizator from '../renderer/audio_visualizator';

class Speaker {

    constructor() {
        this.isPlaying = false;
        this.playSound = null;
    }

    speak(url) {
        const dfd = new Deferred();

        let context = new AudioContext();
        let sound;

        NetworkAdapter.getSound(url).then( (response) => {
            context.decodeAudioData(response, (buffer) => {

                sound = buffer;
                const playSound = context.createBufferSource();
                playSound.buffer = sound;
                playSound.connect(context.destination);

                setTimeout(AudioVisualizator.renderAudio({
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
        }
    }

    // COMMANDS
    greeting({ name }) {
        const dfd = new Deferred();

        NetworkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.GREETING.replace('${name}', name)).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }

    parting({ name }) {
        const dfd = new Deferred();

        NetworkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.PARTING.replace('${name}', name)).then((data) => {
             this.speak(data.snd_url).then(() => {
                dfd.resolve();
             });
        });

        return dfd.promise();
    }

    time({ hours, minutes }) {
        const dfd = new Deferred();

        NetworkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.TIME
                                                                    .replace('${hours}', hours)
                                                                    .replace('${minutes}', minutes)).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }

    openWebpage(page) {
        const dfd = new Deferred();

        NetworkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.WEBPAGE.replace('${page}', page)).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }

    closeWebpage() {
        const dfd = new Deferred();
        
        NetworkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.CLOSE_WEBPAGE).then((data) => {
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
        NetworkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.SHOW_TWEETS).then((data) => {
            this.speak(data.snd_url);
        });
    }

    openFile(fileName) {
        const dfd = new Deferred();
        
        NetworkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.OPEN_FILE.replace('${fileName}', fileName)).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }

    closeFile() {
        const dfd = new Deferred();
        
        NetworkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.CLOSE_FILE).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }
}

const speaker = new Speaker();

export default speaker;
