import Mark from 'markup-js';
import { Deferred } from 'jquery-deferred';

import HeaderTemplate from '../templates/header';
import GreetingTemplate from '../templates/greeting';
import PartingTemplate from '../templates/parting';

import AudioVisualizator from './audio_visualizator';

class Renderer {
    constructor() {
        this.headerIsShown = false;
        this.lastMessage = null;
        this.header = null;
        this.canvas = null;
    }

    init(container) {
        this.container = container;
    }

    createElement(component, data) {
        const insides = Mark.up(component.template, data);
        const container = document.createElement(component.node);
        container.className = component.class;
        container.innerHTML = insides;

        return container
    }

    showMessage(component, data) {
        const dfd = new Deferred();

        const container = this.createElement(component, data);

        this.container.appendChild(container);

        const listener = () => {
            this.lastMessage = container;

            container.removeEventListener('transitionend', listener);
            dfd.resolve();
        };

        container.addEventListener('transitionend', listener);

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                container.style.transform = 'translate3d(0, 0, 0)';
            });
        });

        return dfd.promise();
    }

    showHeader() {
        if (this.headerIsShown) {
            return (new Deferred()).resolve().promise();
        }

        console.log('show header');
        this.headerIsShown = true;
        const header = this.createElement(HeaderTemplate, {});
        this.container.appendChild(header);

        this.header = header;
        this.canvas = document.getElementById('audio-output');

        AudioVisualizator.setCanvas(this.canvas);

        return (new Deferred()).resolve().promise();
    }

    hideHeader() {
        console.log('hide header.');

        this.container.removeChild(this.header);
        this.canvas = null;
        this.header = null;
        this.headerIsShown = false;
        AudioVisualizator.removeCanvas();

        return (new Deferred()).resolve().promise();
    }

    hideLastMessage() {
        console.log('hide last message');

        if (!this.lastMessage) {
            return (new Deferred()).resolve().promise();
        }

        const dfd = new Deferred();

        this.lastMessage.style.transform = '';
        // this.lastMessage.style.opacity = '0';

        const listener = () => {
            console.log('transition end');
            this.lastMessage.removeEventListener('transitionend', listener);
            this.container.removeChild(this.lastMessage);
            this.lastMessage = null;
            dfd.resolve();
        };

        this.lastMessage.addEventListener('transitionend', listener);

        return dfd.promise();
    }

    // COMMMANDS
    greeting(data) {
        console.log('greeting');

        const dfd = new Deferred();

        this.showMessage(GreetingTemplate, data).then(() => { dfd.resolve(); });

        return dfd.promise();
    }

    parting(data) {
        console.log('parting');
        const dfd = new Deferred();

        this.showMessage(PartingTemplate, data).then(() => { dfd.resolve(); });

        return dfd.promise();
    }
}

const renderer = new Renderer();

export default renderer;
