// node modules
import { expect, assert } from 'chai';
import sinon from 'sinon';
import $, { Deferred } from 'jquery-deferred';

// modules
import CommandsAdapter from 'adapters/commands_adapter';
import Renderer from 'renderer/renderer';
import Speaker from 'adapters/speaker';
import SpeechAdapter from 'adapters/speech_adapter';

// mock audio context class for browser imitation
class AudioContext {
    decodeAudioData(arr, callback) {
        callback();
    }

    createBufferSource() {
        return {
            connect: () => {},
            start: () => {},
            stop: () => {}
        };
    }

    close() {

    }
}

function test() {

    let adapter;

    // mock network adapter
    let networkAdapter;
    let spyGetSound;
    let spyGetSoundUrl;
    let spyLoadTweets;

    const testUrl = 'test_url';
    const mockTweets = [ { text: 'test_text', our: 'our_info' }, { user: { profile_image_url: 'test_image_url' } } ];

    // speech adapter watching
    let speechAdapter;
    let setCommands;
    let start;

    // mock audio vizualizator
    let audioVisualizator;
    let spyRenderAudio;
    let spyRemove;
    let spySet;
    let stopRenderAudio;

    // renderer
    let container;
    let renderer;

    // speaker
    let speaker;

    describe('\nCommands adapter', function () {

        beforeEach(() => {
            if (!window) {
                global.window = {};
            }

            // global browser mock for renderer module
            window.requestAnimationFrame = (cb) => {
                setTimeout(cb, 0);
            };

            window.open = (str) => {
                return {
                    location: str
                };
            }

            // global browser mock for speaker module
            window.AudioContext = AudioContext;

            // network adapter mock
            spyGetSound = sinon.spy(),
            spyGetSoundUrl = sinon.spy();
            spyLoadTweets = sinon.spy();

            networkAdapter = {
                getSound: (url) => {
                    spyGetSound(url);
                    return (new Deferred()).resolve(new ArrayBuffer(79698)).promise();
                },
                getSoundUrl: (string) => {
                    spyGetSoundUrl(string);
                    return (new Deferred()).resolve({ snd_url: testUrl }).promise();
                },
                loadTweets: () => {
                    spyLoadTweets();
                    return (new Deferred()).resolve(mockTweets).promise();
                }
            };

            // speech adapter
            setCommands = sinon.spy();
            start = sinon.spy();

            speechAdapter = new SpeechAdapter({
                setCommands,
                start
            });

            // audio visualizator mock

            spySet = sinon.spy();
            spyRemove = sinon.spy();
            spyRenderAudio = sinon.spy();
            stopRenderAudio = sinon.spy();

            audioVisualizator = {
                setCanvas: spySet,
                removeCanvas: spyRemove,
                renderAudio: spyRenderAudio,
                stopRenderAudio: stopRenderAudio
            };

            // renderer
            container = document.createElement('div');

            renderer = new Renderer(container, audioVisualizator);

            speaker = new Speaker(networkAdapter, audioVisualizator);

            adapter = new CommandsAdapter(audioVisualizator, networkAdapter, renderer, speaker, speechAdapter);
            adapter.init();

            speechAdapter.setCommands(adapter.commands);

            // change timeout constants
            adapter.messageTimeout = 10;
        });

        afterEach(() => {
            adapter = null;
        });

        describe('greeting method should to greet with user', function () {

            it ('greeting method should display header', (done) => {

                adapter.greeting().then(() => {

                    // check canvas
                    let header = container.childNodes[0];
                    let canvas = header.childNodes[0];
                    expect(canvas.nodeName).equals('CANVAS');
                    expect(canvas.className).equals('audio-output');

                    done();
                });

            });

            it ('greeting method should speak greet message', (done) => {

                adapter.greeting().then(() => {

                    // we try to draw audio on canvas
                    expect(spyRenderAudio.calledWith()).equals(true);

                    done();
                });

            });

            it ('greeting method should display greet message', (done) => {

                adapter.greeting().then(() => {

                    // renderer show message with correct template
                    expect(container.childNodes[1].childNodes[0].innerHTML).equals('Привет, Эдвардс!');

                    done();
                });

            });

            it ('greeting method should start cathing main commands', (done) => {

                adapter.greeting().then(() => {

                    // speech adapter set correct commands to recognizer
                    expect(setCommands.calledWith(adapter.commands.mainCommands)).equals(true);

                    done();
                });

            });

            it ('greeting method should hide greet message by timeout', (done) => {

                adapter.greeting().then(() => {

                    setTimeout(() => {
                        // check number of dom nodes into app container
                        expect(container.childNodes.length).equals(1);

                        done();
                    }, 50);

                });
            });

            it ('greeting method should stop rendering of current audio message', (done) => {

                adapter.greeting().then(() => {

                    setTimeout(() => {
                        // check that UI stops rendering audio stream
                        expect(stopRenderAudio.calledWith()).equals(true);

                        done();
                    }, 50);

                });

            });

        });

        describe('parting method should to part with user', function () {
            
            it ('parting method should speak parting message', (done) => {

                adapter.greeting().then(() => {
                    adapter.parting().then(() => {
                        // we try to draw audio on canvas
                        expect(spyRenderAudio.calledWith()).equals(true);
                        done();
                    });
                });

            });

            it ('parting method should display parting message', (done) => {

                adapter.greeting().then(() => {
                    adapter.parting().then(() => {
                        // renderer show message with correct template
                        expect(container.childNodes[1].childNodes[0].innerHTML).equals('Пока, Эдвардс!');
                        done();
                    });
                });
                
            });

            it ('parting method should stop rendering of current audio message', (done) => {

                adapter.greeting().then(() => {
                    adapter.parting().then(() => {
                        setTimeout(() => {
                            // check that UI stops rendering audio stream
                            expect(stopRenderAudio.calledWith()).equals(true);
                            done();
                        }, 50);
                    });
                });

            });

            it ('parting method should remove header and parting message', (done) => {

                adapter.greeting().then(() => {
                    adapter.parting().then(() => {
                        setTimeout(() => {
                            // check number of dom nodes into app container
                            expect(container.childNodes.length).equals(0);
                            done();
                        }, 50);
                    });
                });

            });

            it ('parting method should start cathing greeting command', (done) => {

                adapter.greeting().then(() => {
                    adapter.parting().then(() => {
                        setTimeout(() => {
                            // speech adapter set correct commands to recognizer
                            expect(setCommands.calledWith(adapter.commands.greeting)).equals(true);
                            done();
                        }, 50);
                    });
                });

            });

        });

        describe('time method should present current time to user', function () {

            it ('time method should speak time message', (done) => {

                adapter.greeting().then(() => {
                    adapter.parting().then(() => {
                        // we try to draw audio on canvas
                        expect(spyRenderAudio.calledWith()).equals(true);
                        done();
                    });
                });

            });

            it ('time method should display time message', (done) => {

                adapter.greeting().then(() => {
                    adapter.time().then(() => {

                        const date = new Date();
                        const hours = date.getHours();
                        const minutes = date.getMinutes()
                        // renderer show message with correct template
                        expect(container.childNodes[1].childNodes[0].innerHTML).equals(`Сейчас ${hours}:${minutes}`);
                        done();
                    });
                });
                
            });

            it ('time method should remove message', (done) => {

                adapter.greeting().then(() => {
                    adapter.time().then(() => {
                        setTimeout(() => {
                            // check number of dom nodes into app container
                            expect(container.childNodes.length).equals(1);
                            done();
                        }, 50);
                    });
                });

            });

            it ('time method should stop rendering current audio stream', (done) => {

                adapter.greeting().then(() => {
                    adapter.time().then(() => {
                        setTimeout(() => {
                            // check that UI stops rendering audio stream
                            expect(stopRenderAudio.calledWith()).equals(true);
                            done();
                        }, 50);
                    });
                });

            });

        });

        describe('openWebpage method should open passed webpage', function () {

            it ('openWebpage method should speak correct message', (done) => {

                adapter.greeting().then(() => {
                    setTimeout(() => {
                        adapter.openWebpage(true, 'google.com').then(() => {
                            // we try to draw audio on canvas
                            expect(spyRenderAudio.calledWith()).equals(true);
                            done();
                        });
                    }, 10);
                });

            });

            it ('openWebpage method should try to open web page', (done) => {

                adapter.greeting().then(() => {
                    setTimeout(() => {
                        adapter.openWebpage(true, 'google.com').then(() => {
                            // renderer show message with correct template
                            expect(renderer.window.location).equals('http://www.google.com');
                            done();
                        });
                    }, 10);
                });
                
            });

            it ('openWebpage method should stop rendering current audio stream', (done) => {

                adapter.greeting().then(() => {
                    setTimeout(() => {
                        adapter.openWebpage(true, 'google.com').then(() => {
                            setTimeout(() => {
                                // check that UI stops rendering audio stream
                                expect(stopRenderAudio.calledWith()).equals(true);
                                done();
                            }, 30);
                        });
                    }, 30);
                });

            });

        });

        describe('openFile method should play audio and video file', function () {

            it ('openFile method should speak correct message', (done) => {

                adapter.greeting().then(() => {
                    setTimeout(() => {
                        adapter.openFile('open', 'test.mp3').then(() => {
                            // we try to draw audio on canvas
                            expect(spyRenderAudio.calledWith()).equals(true);
                            done();
                        });
                    }, 10);
                });

            });

            it ('openFile method should start play video file', (done) => {

                adapter.greeting().then(() => {
                    setTimeout(() => {
                        adapter.openFile('open', 'test.mp4').then(() => {
                            // we try to draw audio on canvas
                            expect(container.childNodes[1].className).equals('video-player');
                            done();
                        });
                    }, 10);
                });

            });

            it ('openFile method should start play audio file', (done) => {

                adapter.greeting().then(() => {
                    setTimeout(() => {
                        adapter.openFile('open', 'test.mp3').then(() => {
                            // we try to draw audio on canvas
                            expect(spyRenderAudio.calledWith()).equals(true);
                            done();
                        });
                    }, 10);
                });

            });

        });

        describe('showTweets method should present last tweets to user', function () {

            it ('showTweets method should load tweets', (done) => {

                // check, that network adapter try to load tweets using spyLoadTweets
                adapter.greeting().then(() => {
                    adapter.showTweets().then(() => {
                        // we try to draw audio on canvas
                        expect(spyLoadTweets.calledWith()).equals(true);
                        done();
                    });
                });

            });

            it ('showTweets method should speak about current tweets', (done) => {

                adapter.greeting().then(() => {
                    adapter.showTweets().then(() => {
                        // we try to draw audio on canvas
                        expect(spyRenderAudio.calledWith()).equals(true);
                        done();
                    });
                });

            });

            it ('showTweets method should display tweets', (done) => {

                adapter.greeting().then(() => {
                    adapter.showTweets().then(() => {
                        // renderer show message with correct items length
                        expect(container.childNodes[1].childNodes[0].childNodes.length).equals(mockTweets.length * 2 + 1);
                        done();
                    });
                });

            });

            it ('showTweets method should hide tweets after timeout', (done) => {

                adapter.greeting().then(() => {
                    adapter.showTweets().then(() => {
                        setTimeout(() => {
                            // renderer show message with correct items length
                            expect(container.childNodes.length).equals(1);
                            done();
                        }, 50);
                    });
                });

            });

            it ('showTweets method should stop current audio stream', (done) => {

                adapter.greeting().then(() => {
                    adapter.showTweets().then(() => {
                        setTimeout(() => {
                            // stop of playout and rerendering of canvas
                            expect(stopRenderAudio.calledWith()).equals(true);
                            done();
                        }, 50);
                    });
                });

            });

        });

        // end of commands describe
    });
}

export default {
    test
};
