import { Deferred } from 'jquery-deferred';
import { getJSON, get } from 'jquery';

// renderers
import Renderer from './renderer/renderer';
import AudioVisualizator from './renderer/audio_visualizator';

// adapters
import NetworkAdapter from './adapters/network_adapter';
import CommandsAdapter from './adapters/commands_adapter';

// speach
import SpeechAdapter from './adapters/speech_adapter';
import Speaker from './adapters/speaker';

// recognizer
import Recognizer from './adapters/recognizer';

export default class App {
    constructor(container) {
        this.networkAdapter = new NetworkAdapter({
            getJSON,
            get
        });

        this.audioVisualizator = new AudioVisualizator();
        this.recognizer = new Recognizer({
            lang: 'ru'
        });

        this.renderer = new Renderer(container, this.audioVisualizator);
        this.speaker = new Speaker(this.networkAdapter, this.audioVisualizator);

        this.speechAdapter = new SpeechAdapter(this.recognizer);

        this.commandsAdapter = new CommandsAdapter(this.audioVisualizator, this.networkAdapter, this.renderer, this.speaker, this.speechAdapter);

        this.commandsAdapter.init();
    }

    init() {
        const dfd = new Deferred();

        this.networkAdapter.loadInitialData().then(() => { dfd.resolve(); });

        return dfd.promise();
    }

    start() {
        this.speechAdapter
            .setCommands(this.commandsAdapter.commands)
            .waitGreeeting()
            .start();

        window.adapter = this.commandsAdapter;
    }
}
