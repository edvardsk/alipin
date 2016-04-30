import _ from 'lodash';
import { Deferred } from 'jquery-deferred';

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

        this.messageTimeout = 0;
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
        const dfd = new Deferred();

        this.renderer.showHeader().then(() => {
            this.speaker.greeting(Constants.USER).then(() => {
                this.renderer.greeting(Constants.USER, this.messageTimeout > 0).then(() => {
                    this.speechAdapter
                        .startMainCommands();

                    dfd.resolve();

                    this.currentTimeout = setTimeout(() => {
                        this.renderer.hideLastMessage(false, this.messageTimeout > 0);
                        this.audioVisualizator.stopRenderAudio();
                    }, this.messageTimeout || Constants.SMALL_MESSAGE_TIMEOUT);

                });
            });
        });

        return dfd.promise();
    };

    parting = () => {
        const dfd = new Deferred();

        clearTimeout(this.currentTimeout);
        this.currentTimeout = null;


        this.renderer.hideLastMessage(false, this.messageTimeout > 0).then(() => {
            this.speaker.parting(Constants.USER).then(() => {
                this.renderer.parting(Constants.USER, this.messageTimeout > 0).then(() => {

                    dfd.resolve();

                    setTimeout(() => {
                        this.renderer.hideLastMessage(false, this.messageTimeout > 0).always(() => {
                            this.audioVisualizator.stopRenderAudio();
                            this.renderer.hideHeader().then(() => {
                                this.speechAdapter
                                    .waitGreeeting();
                            });
                        });
                    }, this.messageTimeout || Constants.SMALL_MESSAGE_TIMEOUT);

                });
            });
        });

        return dfd.promise();
    };

    time = () => {
        const dfd = new Deferred();
        const date = new Date();

        const dateTime = {
            hours: date.getHours(),
            minutes: date.getMinutes()
        };

        this.renderer.hideLastMessage(false, this.messageTimeout > 0).then(() => {
            this.speaker.time(dateTime).then(() => {
                this.renderer.time(dateTime, this.messageTimeout > 0).then(() => {
                    dfd.resolve();

                    setTimeout(() => {
                        this.renderer.hideLastMessage(false, this.messageTimeout > 0);
                        this.audioVisualizator.stopRenderAudio();
                    }, this.messageTimeout || Constants.SMALL_MESSAGE_TIMEOUT);
                });
            });
        });

        return dfd.promise();
    };

    openWebpage = (open, page) => {
        const dfd = new Deferred();

        this.renderer.hideLastMessage(true, this.messageTimeout > 0).always(() => {
            this.speaker.openWebpage(page).then(() => {
                this.renderer.webpage(Constants.WEB_PAGE.replace('${page}', page)).then(() => {
                    dfd.resolve();
                    setTimeout(() => {
                        this.audioVisualizator.stopRenderAudio();
                    }, this.messageTimeout || Constants.SMALL_MESSAGE_TIMEOUT);
                });
            });
        });

        return dfd.promise();
    };

    closeWebpage = () => {
        const dfd = new Deferred();

        if (!this.renderer.window) { return; }

        this.renderer.hideLastMessage(false, this.messageTimeout > 0).then(() => {
            this.speaker.closeWebpage().then(() => {
                dfd.resolve();
                setTimeout(() => {
                    this.audioVisualizator.stopRenderAudio();
                }, this.messageTimeout || Constants.SMALL_MESSAGE_TIMEOUT);
            });
        });

        return dfd.promise();
    };

    openFile = (action, file) => {
        const dfd = new Deferred();
        const nameFile = file.replace(/ /g,'').toLowerCase();
        const fileName = Constants.MEDIA_FILE_PATH.replace('${fileName}', nameFile);

        this.speaker.stopPlayAudio();

        let play;

        if (fileName.match(/.(mp3|wav)$/)) {
            // play audio file
            play = _.bind(this.speaker.playAudio, this.speaker);
        } else if (fileName.match(/.(mp4|avi)$/)) {
            // play video file
            play = _.bind(this.renderer.playVideo, this.renderer);
        }

        this.renderer.hideLastMessage(false, this.messageTimeout > 0).then(() => {
            this.speaker.openFile(nameFile).then(() => {
                setTimeout(() => {
                    play(fileName);
                    dfd.resolve();
                }, this.messageTimeout || Constants.SMALL_MESSAGE_TIMEOUT );
            });
        });
        return dfd.promise();
    };

    closeFile = () => {
        const dfd = new Deferred();
        console.log('close file');

        this.renderer.hideLastMessage(false, this.messageTimeout > 0).then(() => {
            this.speaker.stopPlayAudio().then(() => {
                this.speaker.closeFile().then(() => {
                    setTimeout(() => {
                        this.audioVisualizator.stopRenderAudio();
                        dfd.resolve();
                    }, this.messageTimeout || Constants.SMALL_MESSAGE_TIMEOUT );
                });
            });
        });
        return dfd.promise();
    };

    showTweets = () => {
        const dfd = new Deferred();
        this.renderer.hideLastMessage(false, this.messageTimeout > 0).then(() => {
            this.networkAdapter.loadTweets().then((tweets) => {
                this.speaker.showTweets();
                this.renderer.showTweets({tweets}, this.messageTimeout > 0).then(() => {
                    dfd.resolve();
                    setTimeout(() => {
                        this.renderer.hideLastMessage(false, this.messageTimeout > 0);
                        this.audioVisualizator.stopRenderAudio();
                    }, this.messageTimeout || Constants.LARGE_MESSAGE_TIMEOUT);
                });
            });
        });
        return dfd.promise();
    };

}
