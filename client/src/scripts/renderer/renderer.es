import Mark from 'markup-js';
import { Deferred } from 'jquery-deferred';

import HeaderTemplate from '../templates/header';
import GreetingTemplate from '../templates/greeting';
import PartingTemplate from '../templates/parting';

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

    showMessage(component, data, isHeader) {
        const dfd = new Deferred();

        const insides = Mark.up(component.template, data);
        const container = document.createElement(component.node);
        container.className = component.class;
        container.innerHTML = insides;

        this.container.appendChild(container);

        const listener = () => {
            if (isHeader) {
                this.header = container;
            } else {
                this.lastMessage = container;
            }

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
        const dfd = new Deferred();

        if (this.headerIsShown) {
            return dfd.resolve().promise();
        }

        console.log('show header');
        this.headerIsShown = true;
        this.showMessage(HeaderTemplate, {}, true).then(() => {
            this.canvas = document.getElementById('audio-output');
            dfd.resolve();
        });

        return dfd.promise();
    }

    hideHeader() {
        console.log('hide header.');
        const dfd = new Deferred();
        this.header.style.transform = '';
        // this.header.style.opacity = '0';

        const listener = () => {
            console.log('transition end');
            this.header.removeEventListener('transitionend', listener);
            this.container.removeChild(this.header);
            this.header = null;
            this.headerIsShown = false;
            dfd.resolve();
        };

        this.header.addEventListener('transitionend', listener);
        return dfd.promise();
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

    renderAudio(data) {

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
