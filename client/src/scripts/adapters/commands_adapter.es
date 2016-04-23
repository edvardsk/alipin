import _ from 'lodash';

import Constants from '../constants/constants';

export default class CommandsAdapter {

    constructor(audioVisualizator, networkAdapter, renderer, speaker, speechAdapter) {
        this.currentTimeout = null;
        this.isActionBlocked = false;

        this.renderer = renderer;
        this.speaker = speaker;
        this.audioVisualizator = audioVisualizator;
        this.networkAdapter = networkAdapter;
        this.speechAdapter = speechAdapter;

        this.commands = null;
    }

    init() {
        this.commands = {
            greeting: {
                ':lривет :name': {
                    regexp: /(п|П)ривет (алейкум|Алекс|олефин|алекян)/,
                    callback: _.partial(this.command, this.greeting)
                }
            },
            mainCommands: {
                // bye
                'пока :name': {
                    regexp: /пока (алейкум|Алекс|олефин|алекян)/,
                    callback: _.partial(this.command, this.parting)
                },

                // time
                ':question сейчас :time': {
                    regexp: /(который|сколько) сейчас (час|времени)/,
                    callback: _.partial(this.command, this.time)
                },

                // web pages
                'открой :page :address': {
                    regexp: /открой (сайт|страницу) (.+)/,
                    callback: _.partial(this.command, this.openWebpage)
                },
                'закрой :page': {
                    regexp: /закрой (сайт|страницу)/,
                    callback: _.partial(this.command, this.closeWebpage)
                },

                // files
                ':action файл :file': {
                    regexp: /(проиграй|открой) файл (.+)/,
                    callback: _.partial(this.command, this.openFile)
                },
                'выключи музыку': _.partial(this.command, this.closeFile),
                'выключи видео': _.partial(this.command, this.closeFile),
                'останови файл': _.partial(this.command, this.closeFile),
                'закрой файл': _.partial(this.command, this.closeFile),

                // tweets
                'покажи :name': {
                    regexp: /покажи (цветы|клипы)/,
                    callback: _.partial(this.command, this.showTweets)
                }

                // weather
            }
        };
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
            this.speaker.stopPlayAudio();
            action(...args);
            this.blockActions();
        }
    };

    greeting = () => {
        this.renderer.showHeader().then(() => {
            this.speaker.greeting(Constants.USER).then(() => {
                this.renderer.greeting(Constants.USER);
                this.speechAdapter
                    .startMainCommands();

                this.currentTimeout = setTimeout(() => {
                    this.renderer.hideLastMessage();
                    this.audioVisualizator.stopRenderAudio();
            }, Constants.SMALL_MESSAGE_TIMEOUT);
            });
        });
    };

    parting = () => {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = null;

        this.renderer.hideLastMessage().then(() => {
            this.speaker.parting(Constants.USER).then(() => {
                this.renderer.parting(Constants.USER).then(() => {

                    setTimeout(() => {
                        this.renderer.hideLastMessage().then(() => {
                            this.audioVisualizator.stopRenderAudio();
                            this.renderer.hideHeader().then(() => {
                                this.speechAdapter
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

        this.renderer.hideLastMessage().then(() => {
            this.speaker.time(dateTime).then(() => {
                this.renderer.time(dateTime).then(() => {
                    setTimeout(() => {
                        this.renderer.hideLastMessage();
                        this.audioVisualizator.stopRenderAudio();
                    }, Constants.SMALL_MESSAGE_TIMEOUT);
                });
            });
        });
    };

    openWebpage = (open, page) => {
        this.renderer.hideLastMessage(true).then(() => {
            this.speaker.openWebpage(page).then(() => {
                this.renderer.webpage(Constants.WEB_PAGE.replace('${page}', page)).then(() => {
                    setTimeout(() => {
                        this.audioVisualizator.stopRenderAudio();
                    }, Constants.SMALL_MESSAGE_TIMEOUT);
                });
            });
        });
    };

    closeWebpage = () => {
        if (!this.renderer.window) { return; }

        this.renderer.hideLastMessage().then(() => {
            this.speaker.closeWebpage().then(() => {
                setTimeout(() => {
                    this.audioVisualizator.stopRenderAudio();
                }, Constants.SMALL_MESSAGE_TIMEOUT);
            });
        });
    };

    openFile = (action, file) => {
        const nameFile = file.replace(/ /g,'').toLowerCase();
        const fileName = Constants.MEDIA_FILE_PATH.replace('${fileName}', nameFile);
        console.log(fileName);

        this.speaker.stopPlayAudio();

        let play;

        if (fileName.match(/.(mp3|wav)$/)) {
            // play audio file
            play = _.bind(this.speaker.playAudio, this.speaker);
        } else if (fileName.match(/.(mp4|avi)$/)) {
            // play video file
            play = _.bind(this.renderer.playVideo, this.renderer);
        }

        this.renderer.hideLastMessage().then(() => {
            this.speaker.openFile(nameFile).then(() => {
                setTimeout(() => {
                    play(fileName);
                }, 3000);
            });
        });
    };

    closeFile = () => {
        console.log('close file');

        this.renderer.hideLastMessage().then(() => {
            this.speaker.stopPlayAudio().then(() => {
                this.speaker.closeFile().then(() => {
                    setTimeout(() => {
                        this.audioVisualizator.stopRenderAudio();
                    }, 3000);
                });
            });
        });
    };

    showTweets = () => {
        this.renderer.hideLastMessage().then(() => {
            this.networkAdapter.loadTweets().then((tweets) => {
                this.speaker.showTweets();
                this.renderer.showTweets({tweets}).then(() => {
                    setTimeout(() => {
                        this.renderer.hideLastMessage();
                        this.audioVisualizator.stopRenderAudio();
                    }, Constants.LARGE_MESSAGE_TIMEOUT);
                });
            });
        });
    };

}
