import _ from 'lodash';
import Renderer from '../renderer/renderer';
import Speaker from './speaker';
import Constants from '../constants/constants';
import SpeechAdapter from './speech_adapter';
import AudioVisualizator from '../renderer/audio_visualizator';

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

    command = (action) => {
        if (!this.isActionBlocked) {
            action();
            this.blockActions();
        }
    };

    greeting = () => {
        Renderer.showHeader().then(() => {
            Speaker.greeting(Constants.USER).then(() => {
                Renderer.greeting(Constants.USER);
                SpeechAdapter
                    .stopGreeting()
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
                                    .stopMainCommands()
                                    .waitGreeeting();
                            });
                        });
                    }, Constants.SMALL_MESSAGE_TIMEOUT);

                });
            });
        });
    };

}

export const adapter = new CommandsAdapter();
// DEV
window.adapter = adapter;

export const commands = {
    greeting: [
        {
            name: 'hello',
            command: /(привет|ок|окей|Привет) ?(Альпен|альпин|алиби|Алексин|Аникин|алейкум)?/,
            action: _.partial(adapter.command, adapter.greeting)
        }
    ],
    mainCommands: [
        {
            name: 'end',
            command: /(Пока|Прощай|пока|прощай) ?(Альпен|альпин|алиби)?/,
            action: _.partial(adapter.command, adapter.parting)
        }
    ]
};

export default {
    commands,
    adapter
};
