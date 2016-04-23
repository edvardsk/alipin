// import JSDOM from 'mocha-jsdom';
import { expect, assert } from 'chai';
import sinon from 'sinon';
import $, { Deferred } from 'jquery-deferred';

import Renderer from 'renderer/renderer';

// templates for rendering
import GreetingTemplate from 'templates/greeting';
import PartingTemplate from 'templates/parting';
import DateTimeTemplate from 'templates/datetime';
import TweetsTemplate from 'templates/tweets';

function test() {
    const Promise = (new Deferred()).promise().constructor;

    let container;
    let renderer;
    let spySet;
    let spyRemove;

    const testTemplate = {
        template: '<div>{{name}}</div>',
        node: 'div',
        class: 'test_class'
    };

    describe('Renderer module', () => {

        // init fake dom
        // JSDOM();

        beforeEach(() => {
            spySet = sinon.spy();
            spyRemove = sinon.spy();

            container = document.createElement('div');

            renderer = new Renderer(container, {
                setCanvas: spySet,
                removeCanvas: spyRemove
            });
        });

        afterEach(() => {
            container = null;
            spySet = null;
            spyRemove = null;
        });

        describe('showHeader method should create header', () => {

            it ('showHeader should return promise', () => {
                expect(renderer.showHeader()).instanceOf(Promise);
            });

            it ('showHeader should create canvas into div with class "header"', (done) => {
                renderer.showHeader().then(() => {
                    let header = container.childNodes[0];

                    expect(header.nodeName).equals('DIV');
                    expect(header.className).equals('header');

                    let canvas = header.childNodes[0];

                    expect(canvas.nodeName).equals('CANVAS');
                    expect(canvas.className).equals('audio-output');

                    done();
                });
            });

            it ('showHeader should pass canvas to audio visualizator', (done) => {
                renderer.showHeader().then(() => {
                    let canvas = container.childNodes[0].childNodes[0];

                    expect(spySet.calledWith(canvas)).equals(true);

                    done();
                });
            });

            it ('showHeader should reject promise in case header is already shown', (done) => {
                renderer.showHeader().then(() => {
                    renderer.showHeader().fail(() => {
                        done();
                    });
                });
            });

        });

        describe('hideHeader method should hide header', () => {
            it ('hideHeader should return promise', () => {
                expect(renderer.hideHeader()).instanceOf(Promise);
            });

            it ('should reject promise in case of no header', (done) => {
                renderer.hideHeader().fail(() => {
                    done();
                });
            });

            it ('hideHeader should remove all nodes from container', (done) => {
                renderer.showHeader().then(() => {
                    renderer.hideHeader().then(() => {
                        expect(container.childNodes.length).equals(0);
                        done();
                    })
                });
            });

            it ('hideHeader should call removeCanvas from audio visualizator', (done) => {
                renderer.showHeader().then(() => {
                    let canvas = container.childNodes[0].childNodes[0];

                    renderer.hideHeader().then(() => {
                        expect(spyRemove.calledWith()).equals(true);
                        done();
                    });
                });
            });
        });

        describe('createElement method should create element according to passing data and template', () => {
            it ('createElement should throw exception', () => {
                assert.throws(renderer.createElement, 'No template exception');
            });

            it ('createElement should throw exception for not fully template', () => {
                assert.throws(renderer.createElement.bind(this, {}), 'Incorrect arguments exception');
                assert.throws(renderer.createElement.bind(this, { template: '<div></div>' }), 'Incorrect arguments exception');
                assert.throws(renderer.createElement.bind(this, { template: '<div></div>', class: 'test_class' }), 'Incorrect arguments exception');
                assert.throws(renderer.createElement.bind(this, { node: 'div' }), 'Incorrect arguments exception');
            });

            it ('createElement should return empty component for empty data', () => {
                const node = renderer.createElement(testTemplate);

                expect(node.childNodes[0].innerHTML).equals('???');
            });

            it ('createElement should return correct component', () => {
                const testString = 'test string';
                const node = renderer.createElement(testTemplate, {
                    name: testString
                });

                expect(node.childNodes[0].innerHTML).equals(testString);

            });
        });
    
        // we cann't test this class with animation
        // ADD NEW FLAG FOR SIMPLE DISPLAYING MESSAGE
        describe('createMessage method should display message according to passing data and template', () => {
            it('createMessage should show message according to template and data', (done) => {
                const testString = 'test string';

                renderer.showMessage(testTemplate, { name: testString }, true).then(() => {
                    expect(container.childNodes[0].childNodes[0].innerHTML).equals(testString);
                    done();
                });

            });

            it('createMessage should show two same messages', (done) => {
                const testString = 'test string';

                const firstMesssage = renderer.showMessage(testTemplate, { name: testString }, true);
                const secondMessage = renderer.showMessage(testTemplate, { name: testString }, true);

                $.when.apply($, [firstMesssage, secondMessage]).done(() => {
                    expect(container.childNodes.length).equals(2);
                    expect(container.childNodes[0].childNodes[0].innerHTML).equals(testString);
                    expect(container.childNodes[1].childNodes[0].innerHTML).equals(testString);
                    done();
                });
            });

            it('createMessage should show two different messages', (done) => {
                const firstTestString = 'first test string';
                const secondTestString = 'second test string';

                const firstMesssage = renderer.showMessage(testTemplate, { name: firstTestString }, true);
                const secondMessage = renderer.showMessage(testTemplate, { name: secondTestString }, true);

                $.when.apply($, [firstMesssage, secondMessage]).done(() => {
                    expect(container.childNodes.length).equals(2);
                    expect(container.childNodes[0].childNodes[0].innerHTML).equals(firstTestString);
                    expect(container.childNodes[1].childNodes[0].innerHTML).equals(secondTestString);
                    done();
                });
            });

        });

        describe('hideLastMessage method should clean screen', () => {
            it('hideLastMessage should hide video if it\'s in background', (done) => {
                renderer.playVideo('1.mp4');

                expect(container.childNodes.length).equals(1);

                renderer.hideLastMessage().then(() => {
                    expect(container.childNodes.length).equals(0);
                    done();
                });
            });

            it('hideLastMessage should close window if it\s is opened', (done) => {
                const close = sinon.spy();

                renderer.window = {
                    close
                };

                renderer.hideLastMessage().then(() => {
                    expect(close.calledWith()).equals(true);
                    done();
                });
            });

            it('hideLastMessage should reject execution if no message to hide', (done) => {
                renderer.hideLastMessage().fail(() => {
                    done();
                });
            });

            // cann't test transition
            // just remove DOM nodes
            it('hideLastMessage should hide message', (done) => {
                renderer.showMessage(testTemplate, { name: 'bob' }, true).then(() => {
                    renderer.hideLastMessage(false, true).then(() => {
                        expect(container.childNodes.length).equals(0);
                        done();
                    });
                });
            });

            it('hideLastMessage should hide last message from two', (done) => {
                renderer.showMessage(testTemplate, { name: 'first' }, true).then(() => {
                    renderer.showMessage(testTemplate, { name: 'last' }, true).then(() => {
                        renderer.hideLastMessage(false, true).then(() => {
                            expect(container.childNodes.length).equals(1);
                            expect(container.childNodes[0].childNodes[0].innerHTML).equals('first');
                            done();
                        });
                    });
                });
            });

        });

        // COMMANDS
        describe('greeting method should show greeting message', () => {
            it('greeting should called showMessage with correct template and passing data', (done) => {
                const passingData = { name: 'Bob' };
                const close = sinon.spy();
                renderer.showMessage = (template, data) => {
                    close(template, data);
                    return (new Deferred).resolve().promise();
                };

                renderer.greeting(passingData).then(() => {
                    expect(close.calledWith(GreetingTemplate, passingData)).equals(true);
                    done();
                });
            });
        });

        describe('parting method should show parting message', () => {
            it('parting should called showMessage with correct template and passing data', (done) => {

                const passingData = { name: 'Bob' };
                const close = sinon.spy();
                renderer.showMessage = (template, data) => {
                    close(template, data);
                    return (new Deferred).resolve().promise();
                };

                renderer.parting(passingData).then(() => {
                    expect(close.calledWith(PartingTemplate, passingData)).equals(true);
                    done();
                });

            });

        });

        describe('time method should show time', () => {
            it('time should called showMessage with correct template and passing data', (done) => {
                const date = new Date();

                const passingData = {
                    hours: date.getHours(),
                    minutes: date.getMinutes()
                };

                const close = sinon.spy();
                renderer.showMessage = (template, data) => {
                    close(template, data);
                    return (new Deferred).resolve().promise();
                };

                renderer.time(passingData).then(() => {
                    expect(close.calledWith(DateTimeTemplate, passingData)).equals(true);
                    done();
                });

            });

        });

        describe('playVideo method should start to play video', () => {
            it('playVideo should create video tag with passing url', () => {
                const fileName = 'test_path.mp4';
                renderer.playVideo(fileName);
                const video = container.childNodes[0];

                expect(video.className).equals('video-player');
                expect(video.src).equals(window.location.origin + window.location.pathname.replace('index.html', fileName));
            });
        });

        describe('showTweets method should show the tweets', () => {
            it('showTweets should called showMessage with correct template and passing data', (done) => {

                const passingData = [ { text: 'test', image: 'test_image.png' } ];

                const close = sinon.spy();
                renderer.showMessage = (template, data) => {
                    close(template, data);
                    return (new Deferred).resolve().promise();
                };

                renderer.showTweets(passingData).then(() => {
                    expect(close.calledWith(TweetsTemplate, passingData)).equals(true);
                    done();
                });
            });
        });

    });
}

export default {
    test
};