import Mark from 'markup-js';
import { Deferred } from 'jquery-deferred';

import HeaderTemplate from '../templates/header';

export default class Renderer {
    constructor(container) {
        this.container = container;
        this.headerIsShown = false;
    }

    showHeader() {
        const dfd = new Deferred();

        if (this.headerIsShown) {
            return dfd.resolve().promise();
        }

        console.log('show header');
        this.headerIsShown = true;
        const headerInsides = Mark.up(HeaderTemplate.template, {});
        const headerContainer = document.createElement(HeaderTemplate.node);
        headerContainer.className = HeaderTemplate.class;
        headerContainer.innerHTML = headerInsides;

        this.container.appendChild(headerContainer);

        headerContainer.addEventListener('transitionend', () => {
            dfd.resolve();
        });

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                headerContainer.style.transform = 'translate3d(0, 0, 0)';
            });
        });

        return dfd.promise();
    }

    hideHeader() {
        console.log('hide header.');
    }

    // COMMMANDS
    greeting(data) {
        console.log('greeting');
        const dfd = new Deferred();

        setTimeout(() => {
            dfd.resolve();
        }, 2000);

        return dfd.promise();
    }
}