import NetworkAdapter from 'adapters/network_adapter';
import { expect, assert } from 'chai';
import sinon from 'sinon';
import $, { Deferred } from 'jquery-deferred';

import Constants from 'constants/constants';

function test() {
    const Promise = (new Deferred()).promise().constructor;

    let networkAdapter;
    let getJSONP;
    let get;

    describe('\nNetwork Adapter module', () => {
        beforeEach(() => {
            getJSONP = sinon.spy(),
            get = sinon.spy();

            networkAdapter = new NetworkAdapter({
                getJSON: (url, options) => {
                    getJSONP(url, options);
                    return (new Deferred()).resolve().promise();
                },
                get
            });
        });

        describe('loadInitialData method do nothing', () => {
            it('should return promise', () => {
                expect(networkAdapter.loadInitialData()).instanceOf(Promise);
            });

            it('should allways resolve promise', (done) => {
                networkAdapter.loadInitialData().then(() => {
                    done();
                });
            });
        });

        describe('getSoundUrl method should make getJSON request to acapella group', () => {

            it('should no call getJSON with empty arguments', () => {
                networkAdapter.getSoundUrl('');
                expect(getJSONP.calledWith()).equals(false);
            });

            it('should call getJSON with correct acapella group arguments', () => {
                const testSeq = 'test sequence';
                networkAdapter.getSoundUrl(testSeq);
                expect(getJSONP.calledWith(
                    Constants.AcapelaGroup.ACAPELA_GROUP_API_URL,
                    {
                        prot_vers: 2,
                        cl_login: Constants.AcapelaGroup.ACAPELA_GROUP_LOGIN,
                        cl_app: Constants.AcapelaGroup.ACAPELA_GROUP_APP,
                        cl_pwd: Constants.AcapelaGroup.ACAPELA_GROUP_PWD, 
                        req_voice:Constants.AcapelaGroup.ACAPELA_GROUP_VOICE, 
                        req_text: testSeq,
                        req_snd_type:"WAV"
                    }
                )).equals(true);
            });

        });

        describe('loadTweets method should load and format last user tweets', () => {
            it('should try to load tweets', () => {
                networkAdapter.loadTweets();
                expect(get.calledWith()).equals(true);
            });

            it('should fomat loaded tweets', (done) => {
                networkAdapter = new NetworkAdapter({
                    getJSON: () => {},
                    get: (url, callback) => {
                        callback([ { text: 'test_text', our: 'our_info' }, { user: { profile_image_url: 'test_image_url' } } ]);
                    }
                });

                networkAdapter.loadTweets().then((tweets) => {
                    expect(tweets.length).equals(2);

                    // first item
                    expect(tweets[0].text).equals('test_text');
                    expect(tweets[0].image).equals(Constants.DEFAULT_TWITTER_IMAGE_URL);

                    // second item
                    expect(tweets[1].text).equals(Constants.EMPTY_TWITTER_MSG);
                    expect(tweets[1].image).equals('test_image_url');

                    done();
                });
            });
        });

    });
}

export default {
    test
};