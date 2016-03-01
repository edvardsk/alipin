var conf = require('../util/conf');
var Twitter = require('mtwitter');

var twitter = new Twitter({
    consumer_key: conf.get('TWITTER_CONSUMER_KEY'),
    consumer_secret: conf.get('TWITTER_CONSUMER_SECRET'),
    access_token_key: conf.get('TWITTER_ACCESS_TOKEN'),
    access_token_secret: conf.get('TWITTER_ACCESS_SECRET')
});

module.exports = function (cb) {
    twitter.get('statuses/home_timeline', {
        screen_name: conf.get('TWITTER_OWNER'),
        count: conf.get('TWITTER_TWEETS_COUNT')
    }, function(err, items) {
        if (err) {
            console.error(err);
        } else {
            cb(items);
        }
    });
}