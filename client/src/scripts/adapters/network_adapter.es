import { Deferred } from 'jquery-deferred';
import { getJSON } from 'jquery';
import Constants from '../constants/constants';

class NetworkAdapter {
    loadInitialData() {
        const dfd = new Deferred();

        setTimeout(() => {
            dfd.resolve();
        }, 100);

        return dfd.promise();
    }

    getSoundUrl(text) {
        const dfd = new Deferred();
        const AcapelaGroup = Constants.AcapelaGroup;

        getJSON(AcapelaGroup.ACAPELA_GROUP_API_URL, {
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
}

const networkAdapter = new NetworkAdapter();

export default networkAdapter;
