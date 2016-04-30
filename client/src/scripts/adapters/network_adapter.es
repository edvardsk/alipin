import _ from 'lodash';
import { Deferred } from 'jquery-deferred';
import Constants from '../constants/constants';

export default class NetworkAdapter {

    constructor(load) {
        this.getJSON = load.getJSON;
        this.get = load.get;
    }

    loadInitialData() {
        const dfd = new Deferred();

        setTimeout(() => {
            dfd.resolve();
        }, 10);

        return dfd.promise();
    }

    getSoundUrl(text) {
        const dfd = new Deferred();
        if (!text) {
            return dfd.resolve().promise();
        }
        const AcapelaGroup = Constants.AcapelaGroup;

        this.getJSON(AcapelaGroup.ACAPELA_GROUP_API_URL, {
            prot_vers: 2,
            cl_login: AcapelaGroup.ACAPELA_GROUP_LOGIN,
            cl_app: AcapelaGroup.ACAPELA_GROUP_APP,
            cl_pwd: AcapelaGroup.ACAPELA_GROUP_PWD, 
            req_voice:AcapelaGroup.ACAPELA_GROUP_VOICE, 
            req_text: text,
            //to produce ogg vorbis files, for MP3 you can remove this param.
            req_snd_type:"WAV"
        }).done((data) => { dfd.resolve(data); });

        return dfd.promise();
    }

    getSound(url) {
        const dfd = new Deferred();

        const getSound = new XMLHttpRequest();
        getSound.open('GET', url, true);
        getSound.responseType = 'arraybuffer';

        getSound.onload = () => {
            dfd.resolve(getSound.response);
        };

        getSound.send();

        return dfd.promise();
    }

    loadTweets() {
        const dfd = new Deferred();

        this.get(Constants.TWEETS_API, (data) => {
            dfd.resolve(_.map(data, ( item ) => {
                const image = item.user && item.user.profile_image_url;

                return {
                    text: item.text || Constants.EMPTY_TWITTER_MSG,
                    image: image || Constants.DEFAULT_TWITTER_IMAGE_URL
                };
            }));
        })

        return dfd.promise();
    }
}
