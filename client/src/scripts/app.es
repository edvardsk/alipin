import { Deferred } from 'jquery-deferred';
import SpeechAdapter from './adapters/speech_adapter';
import Renderer from './renderer/renderer';
import NetworkAdapter from './adapters/network_adapter';

export default class App {
    constructor(container) {
        Renderer.init(container);
    }

    init() {
        const dfd = new Deferred();

        NetworkAdapter.loadInitialData().then(() => { dfd.resolve(); });

        return dfd.promise();
    }

    start() {
        SpeechAdapter.waitGreeeting();
    }
}
