import { Deferred } from 'jquery-deferred';
import SpeechAdapter from './adapters/speech_adapter';
import NetworkAdapter from './adapters/network_adapter';
import Renderer from './renderer/renderer';

export default class App {
    constructor(container) {
        this.speechAdapter = new SpeechAdapter(new Renderer(container));
        this.networkAdapter = new NetworkAdapter();
    }

    init() {
        const dfd = new Deferred();

        this.networkAdapter.loadInitialData().then(() => { dfd.resolve(); });

        return dfd.promise();
    }

    start() {
        this.speechAdapter.waitGreeeting();
    }
}
