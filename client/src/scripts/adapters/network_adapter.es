import { Deferred } from 'jquery-deferred';

export default class NetworkAdapter {
    loadInitialData() {
        const dfd = new Deferred();

        setTimeout(() => {
            dfd.resolve();
        }, 2000);

        return dfd.promise();
    }
}