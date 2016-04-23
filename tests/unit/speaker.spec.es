import Speaker from 'adapters/speaker';
import { expect, assert } from 'chai';
import sinon from 'sinon';
import $, { Deferred } from 'jquery-deferred';

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
    const Promise = (new Deferred()).promise().constructor;
    const testUrl = 'test_url';

    let speaker;
    let spyGetSound;
    let spyGetSoundUrl;
    let spySpeak;
    let spyRenderAudio;

    describe('Speaker module', () => {
        window.AudioContext = AudioContext;

        beforeEach(() => {
            spyGetSound = sinon.spy();
            spyGetSoundUrl = sinon.spy();
            spySpeak = sinon.spy();
            spyRenderAudio = sinon.spy();

            speaker = new Speaker({
                getSound: (url) => {
                    spyGetSound(url);
                    return (new Deferred()).resolve(new ArrayBuffer(79698)).promise();
                },
                getSoundUrl: (string) => {
                    spyGetSoundUrl(string);
                    return (new Deferred()).resolve({ snd_url: testUrl }).promise();
                }
            },{
                renderAudio: spyRenderAudio
            });
        });

        afterEach(() => {
            spyGetSound = null;
            spyGetSoundUrl = null;
            spySpeak = null;
            spyRenderAudio = null;
        });

        describe('speak method should get sound using network adapter and play it', () => {
            it ('speak method should return promise', () => {
                expect(speaker.speak(testUrl)).instanceOf(Promise);
            });

            it ('speak method should throw exception if no url', () => {
                assert.throws(speaker.speak, 'No passed url exception');
            });

            it ('speak method should call getSound with passed url', () => {
                speaker.speak(testUrl);
                expect(spyGetSound.calledWith(testUrl)).equals(true);
            });

            it ('speak method should call renderAudio', (done) => {
                speaker.speak(testUrl).then(() => {
                    expect(spyRenderAudio.calledWith()).equals(true);
                    done();
                });
            });

        });

        describe('stop method should stop playout sound', () => {

            it ('stop method should throw exception if no audio in playout', () => {
                assert.throws(speaker.stop.bind(speaker), 'No execution exception');
            });

            it ('stop method should stop playout if any playout in process', (done) => {
                speaker.speak(testUrl).then(() => {
                    speaker.stop();
                    expect(speaker.playSound).equals(null);
                    done();
                });

            });

        });

        // COMMANDS
        describe('greeting method should call speak with correct args', () => {

            it ('greeting method should return promise', () => {
                expect(speaker.greeting(testUrl)).instanceOf(Promise);
            });

            it ('greeting method should reject promise if no data', (done) => {
                speaker.greeting().fail(() => {
                    done();
                });
            });

            it ('greeting method should call speak with test url', (done, fail) => {
                speaker.speak = (str) => {
                    spySpeak(str);
                    return (new Deferred()).resolve().promise();
                };

                speaker.greeting({
                    name: 'test_name'
                }).then(() => {
                    expect(spySpeak.calledWith(testUrl)).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });

            it ('greeting method should call getSoundUrl with templated string', (done, fail) => {
                speaker.greeting({
                    name: 'test_name'
                }).then(() => {
                    expect(spyGetSoundUrl.calledWith("Привет, test_name!")).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });
        });

        describe('parting method should call speak with correct args', () => {

            it ('parting method should return promise', () => {
                expect(speaker.parting(testUrl)).instanceOf(Promise);
            });

            it ('parting method should reject promise if no data', (done) => {
                speaker.parting().fail(() => {
                    done();
                });
            });

            it ('parting method should call speak with test url', (done, fail) => {
                speaker.speak = (str) => {
                    spySpeak(str);
                    return (new Deferred()).resolve().promise();
                };

                speaker.parting({
                    name: 'test_name'
                }).then(() => {
                    expect(spySpeak.calledWith(testUrl)).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });

            it ('parting method should call getSoundUrl with templated string', (done, fail) => {
                speaker.parting({
                    name: 'test_name'
                }).then(() => {
                    expect(spyGetSoundUrl.calledWith("Пока, test_name")).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });
        });

        describe('time method should call speak with correct args', () => {

            it ('time method should return promise', () => {
                expect(speaker.time(testUrl)).instanceOf(Promise);
            });

            it ('time method should reject promise if no data', (done) => {
                speaker.time().fail(() => {
                    done();
                });
            });

            it ('time method should call speak with test url', (done, fail) => {
                speaker.speak = (str) => {
                    spySpeak(str);
                    return (new Deferred()).resolve().promise();
                };

                speaker.time({
                    hours: 2,
                    minutes: 14
                }).then(() => {
                    expect(spySpeak.calledWith(testUrl)).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });

            it ('time method should call getSoundUrl with templated string', (done, fail) => {
                speaker.time({
                    hours: 2,
                    minutes: 14
                }).then(() => {
                    expect(spyGetSoundUrl.calledWith("Сейчас: 2:14")).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });
        });

        describe('openWebpage method should call speak with correct args', () => {

            it ('openWebpage method should return promise', () => {
                expect(speaker.openWebpage(testUrl)).instanceOf(Promise);
            });

            it ('openWebpage method should reject promise if no data', (done) => {
                speaker.openWebpage().fail(() => {
                    done();
                });
            });

            it ('openWebpage method should call speak with test url', (done, fail) => {
                speaker.speak = (str) => {
                    spySpeak(str);
                    return (new Deferred()).resolve().promise();
                };

                speaker.openWebpage('test_page').then(() => {
                    expect(spySpeak.calledWith(testUrl)).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });

            it ('openWebpage method should call getSoundUrl with templated string', (done, fail) => {
                speaker.openWebpage('test_page').then(() => {
                    expect(spyGetSoundUrl.calledWith("Страница: test_page открыта")).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });
        });

        describe('closeWebpage method should call speak with correct args', () => {

            it ('closeWebpage method should return promise', () => {
                expect(speaker.closeWebpage()).instanceOf(Promise);
            });

            it ('closeWebpage method should call speak with test url', (done, fail) => {
                speaker.speak = (str) => {
                    spySpeak(str);
                    return (new Deferred()).resolve().promise();
                };

                speaker.closeWebpage().then(() => {
                    expect(spySpeak.calledWith(testUrl)).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });

            it ('closeWebpage method should call getSoundUrl with templated string', (done, fail) => {
                speaker.closeWebpage().then(() => {
                    expect(spyGetSoundUrl.calledWith("Веб-страница закрыта")).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });
        
            it ('openWebpage method should return promise', () => {
                expect(speaker.openWebpage(testUrl)).instanceOf(Promise);
            });

            it ('openWebpage method should reject promise if no data', (done) => {
                speaker.openWebpage().fail(() => {
                    done();
                });
            });

            it ('openWebpage method should call speak with test url', (done, fail) => {
                speaker.speak = (str) => {
                    spySpeak(str);
                    return (new Deferred()).resolve().promise();
                };

                speaker.openWebpage('test_page').then(() => {
                    expect(spySpeak.calledWith(testUrl)).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });

            it ('openWebpage method should call getSoundUrl with templated string', (done, fail) => {
                speaker.openWebpage('test_page').then(() => {
                    expect(spyGetSoundUrl.calledWith("Страница: test_page открыта")).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });
        });

        describe('showTweets method should call speak with correct args', () => {

            it ('showTweets method should return promise', () => {
                expect(speaker.showTweets()).instanceOf(Promise);
            });

            it ('showTweets method should call speak with test url', (done, fail) => {
                speaker.speak = (str) => {
                    spySpeak(str);
                    return (new Deferred()).resolve().promise();
                };

                speaker.showTweets().then(() => {
                    expect(spySpeak.calledWith(testUrl)).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });

            it ('showTweets method should call getSoundUrl with templated string', (done, fail) => {
                speaker.showTweets().then(() => {
                    expect(spyGetSoundUrl.calledWith("Последние новости представленны")).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });
        });

        describe('openFile method should call speak with correct args', () => {

            it ('openFile method should return promise', () => {
                expect(speaker.openFile('test_file')).instanceOf(Promise);
            });

            it ('openFile method should reject promise if no data', (done) => {
                speaker.openFile().fail(() => {
                    done();
                });
            });

            it ('openFile method should call speak with test url', (done, fail) => {
                speaker.speak = (str) => {
                    spySpeak(str);
                    return (new Deferred()).resolve().promise();
                };

                speaker.openFile('test_file').then(() => {
                    expect(spySpeak.calledWith(testUrl)).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });

            it ('openFile method should call getSoundUrl with templated string', (done, fail) => {
                speaker.openFile('test_file').then(() => {
                    expect(spyGetSoundUrl.calledWith("Файл test_file открыт")).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });
        });

        describe('closeFile method should call speak with correct args', () => {

            it ('closeFile method should return promise', () => {
                expect(speaker.closeFile()).instanceOf(Promise);
            });

            it ('closeFile method should call speak with test url', (done, fail) => {
                speaker.speak = (str) => {
                    spySpeak(str);
                    return (new Deferred()).resolve().promise();
                };

                speaker.closeFile().then(() => {
                    expect(spySpeak.calledWith(testUrl)).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });

            it ('closeFile method should call getSoundUrl with templated string', (done, fail) => {
                speaker.closeFile().then(() => {
                    expect(spyGetSoundUrl.calledWith("Медиа файл закрыт")).equals(true);
                    done();
                }).fail(() => {
                    fail();
                });
            });
        });

    });
}

export default {
    test
};