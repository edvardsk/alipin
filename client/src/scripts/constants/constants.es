export default {
    SpeakAudioTemplates: {
        GREETING: 'Привет, ${name}!',
        PARTING: 'Пока, ${name}',
        TIME: 'Сейчас: ${hours}:${minutes}',
        WEBPAGE: 'Страница: ${page} открыта',
        CLOSE_WEBPAGE: 'Веб-страница закрыта',
        SHOW_TWEETS: 'Последние новости представленны',
        OPEN_FILE: 'Файл ${fileName} открыт',
        CLOSE_FILE: 'Медиа файл закрыт',
        DISCO: 'Давай устроим'
    },
    MEDIA_FILE_PATH: '/media/${fileName}',
    DISCO_FILE_NAME: 'disco.mp3',
    WEB_PAGE: 'http://www.${page}',
    SMALL_MESSAGE_TIMEOUT: 3000,
    NORMAL_MESSAGE_TIMEOUT: 5000,
    LARGE_MESSAGE_TIMEOUT: 30000,
    AcapelaGroup: {
        ACAPELA_GROUP_API_URL: 'http://vaas.acapela-group.com/Services/UrlMaker?jsoncallback=?',
        ACAPELA_GROUP_APP: 'EVAL_4931850',
        ACAPELA_GROUP_LOGIN: 'EVAL_VAAS',
        ACAPELA_GROUP_PWD: '1g86hwqv',
        ACAPELA_GROUP_VOICE: 'alyona22k'
        //'willbadguy22k'
    },
    TWEETS_API: '/tweets',
    USER: { name: 'Эдвардс' },

    DRAW_INTERVAL: 1000 / 24,
    CANVAS_WIDTH: 480,
    CANVAS_HEIGHT: 480,

    LARGE_CANVAS_WIDTH: 500,
    LARGE_CANVAS_HEIGHT: 500,

    CIRCLES_COUNT: 30,
    CANVAS_HUES: [ 0, 120, 170, 225, 300 ],
    DEFAULT_TWITTER_IMAGE_URL: 'https://pbs.twimg.com/profile_images/666407537084796928/YBGgi9BO.png',
    EMPTY_TWITTER_MSG: 'Sorry, no available information for you'
};
