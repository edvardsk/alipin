var conf = require('../../util/conf');
var logger = require('../../util/logger');
var Twitter = require('mtwitter');

var twitter = new Twitter({
    consumer_key: conf.get('TWITTER_CONSUMER_KEY'),
    consumer_secret: conf.get('TWITTER_CONSUMER_SECRET'),
    access_token_key: conf.get('TWITTER_ACCESS_TOKEN'),
    access_token_secret: conf.get('TWITTER_ACCESS_SECRET')
});

module.exports = {
    exec: function (successCb) {
        twitter.get('statuses/home_timeline', {
            screen_name: conf.get('TWITTER_OWNER'),
            count: conf.get('TWITTER_TWEETS_COUNT')
        }, function(err, item) {
            if (err) {
                logger.error(err);
            } else {
                successCb(item);
            }
        });
    }
};