import _ from 'lodash';
import Renderer from '../renderer/renderer';
import Speaker from './speaker';
import Constants from '../constants/constants';
import SpeechAdapter from './speech_adapter';
import AudioVisualizator from '../renderer/audio_visualizator';
import NetworkAdapter from './network_adapter';

class CommandsAdapter {

    constructor() {
        this.currentTimeout = null;
        this.isActionBlocked = false;
    }

    blockActions = () => {
        this.isActionBlocked = true;

        setTimeout(() => {
            this.unBlockActions();
        }, Constants.NORMAL_MESSAGE_TIMEOUT);
    };

    unBlockActions = () => {
        this.isActionBlocked = false;
    };

    command = (action, ...args) => {
        if (!this.isActionBlocked) {
            Speaker.stopPlayAudio();
            action(...args);
            this.blockActions();
        }
    };

    greeting = () => {
        Renderer.showHeader().then(() => {
            Speaker.greeting(Constants.USER).then(() => {
                Renderer.greeting(Constants.USER);
                SpeechAdapter
                    .startMainCommands();

                this.currentTimeout = setTimeout(() => {
                    Renderer.hideLastMessage();
                    AudioVisualizator.stopRenderAudio();
            }, Constants.SMALL_MESSAGE_TIMEOUT);
            });
        });
    };

    parting = () => {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = null;

        Renderer.hideLastMessage().then(() => {
            Speaker.parting(Constants.USER).then(() => {
                Renderer.parting(Constants.USER).then(() => {

                    setTimeout(() => {
                        Renderer.hideLastMessage().then(() => {
                            AudioVisualizator.stopRenderAudio();
                            Renderer.hideHeader().then(() => {
                                SpeechAdapter
                                    .waitGreeeting();
                            });
                        });
                    }, Constants.SMALL_MESSAGE_TIMEOUT);

                });
            });
        });
    };

    time = () => {
        const date = new Date();

        const dateTime = {
            hours: date.getHours(),
            minutes: date.getMinutes()
        };

        Renderer.hideLastMessage().then(() => {
            Speaker.time(dateTime).then(() => {
                Renderer.time(dateTime).then(() => {
                    setTimeout(() => {
                        Renderer.hideLastMessage();
                        AudioVisualizator.stopRenderAudio();
                    }, Constants.SMALL_MESSAGE_TIMEOUT);
                });
            });
        });
    };

    openWebpage = (open, page) => {
        Renderer.hideLastMessage(true).then(() => {
            Speaker.openWebpage(page).then(() => {
                Renderer.webpage(Constants.WEB_PAGE.replace('${page}', page)).then(() => {
                    setTimeout(() => {
                        AudioVisualizator.stopRenderAudio();
                    }, Constants.SMALL_MESSAGE_TIMEOUT);
                });
            });
        });
    };

    closeWebpage = () => {
        if (!Renderer.window) { return; }

        Renderer.hideLastMessage().then(() => {
            Speaker.closeWebpage().then(() => {
                setTimeout(() => {
                    AudioVisualizator.stopRenderAudio();
                }, Constants.SMALL_MESSAGE_TIMEOUT);
            });
        });
    };

    openFile = (action, file) => {
        const nameFile = file.replace(/ /g,'').toLowerCase();
        const fileName = Constants.MEDIA_FILE_PATH.replace('${fileName}', nameFile);
        console.log(fileName);

        this.closeFile();

        let play;

        if (fileName.match(/.(mp3|wav)$/)) {
            // play audio file
            play = _.bind(Speaker.playAudio, Speaker);
        } else if (fileName.match(/.(mp4|avi)$/)) {
            // play video file
            play = _.bind(Renderer.playVideo, Renderer);
        }

        Renderer.hideLastMessage().then(() => {
            Speaker.openFile(nameFile).then(() => {
                setTimeout(() => {
                    play(fileName);
                }, 3000);
            });
        });
    };

    closeFile = () => {
        console.log('close file');

        Renderer.hideLastMessage().then(() => {
            Speaker.stopPlayAudio().then(() => {
                Speaker.closeFile().then(() => {
                    setTimeout(() => {
                        AudioVisualizator.stopRenderAudio();
                    }, 3000);
                });
            });
        });
    };

    showTweets = () => {
        Renderer.hideLastMessage().then(() => {
            NetworkAdapter.loadTweets().then((tweets) => {
                Speaker.showTweets();
                Renderer.showTweets({tweets}).then(() => {
                    setTimeout(() => {
                        Renderer.hideLastMessage();
                        AudioVisualizator.stopRenderAudio();
                    }, Constants.LARGE_MESSAGE_TIMEOUT);
                });
            });
        });
    };

}

export const adapter = new CommandsAdapter();
// DEV
window.adapter = adapter;

export const commands = {
    greeting: {
        'привет :name': {
            regexp: /^привет (алейкум|Алекс|олефин|алекян)/,
            callback: _.partial(adapter.command, adapter.greeting)
        }
    },
    mainCommands: {
        // bye
        'пока :name': {
            regexp: /^пока (алейкум|Алекс|олефин|алекян)/,
            callback: _.partial(adapter.command, adapter.parting)
        },

        // time
        ':question сейчас :time': {
            regexp: /^(который|сколько) сейчас (час|времени)/,
            callback: _.partial(adapter.command, adapter.time)
        },

        // web pages
        'открой :page :address': {
            regexp: /^открой (сайт|страницу) (.+)/,
            callback: _.partial(adapter.command, adapter.openWebpage)
        },
        'закрой :page': {
            regexp: /^закрой (сайт|страницу)/,
            callback: _.partial(adapter.command, adapter.closeWebpage)
        },

        // files
        ':action файл :file': {
            regexp: /^(проиграй|открой) файл (.+)/,
            callback: _.partial(adapter.command, adapter.openFile)
        },
        'останови файл': _.partial(adapter.command, adapter.closeFile),
        'закрой файл': _.partial(adapter.command, adapter.closeFile),

        // tweets
        'покажи :name': {
            regexp: /^покажи (цветы|клипы)/,
            callback: _.partial(adapter.command, adapter.showTweets)
        }

        // weather
    }
};

export default {
    commands,
    adapter
};
