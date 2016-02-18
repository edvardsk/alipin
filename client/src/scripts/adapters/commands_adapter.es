import Renderer from '../renderer/renderer';
import Speaker from './speaker';
import Constants from '../constants/constants';
import SpeechAdapter from './speech_adapter';
import AudioVisualizator from '../renderer/audio_visualizator';

class CommandsAdapter {

    constructor() {
        this.currentTimeout = null;
    }

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
            command: /^(привет|ок|окей) ?(Альпен|альпин|алиби)?/,
            action: adapter.greeting
        }
    ],
    mainCommands: [
        {
            name: 'end',
            command: /(Пока|Прощай|пока|прощай) ?(Альпен|альпин|алиби)?/,
            action: adapter.parting
        }
    ]
};

export default {
    commands,
    adapter
};
