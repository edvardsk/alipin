import Mumble from 'mumble-js';
import { commands, adapter } from './commands_adapter';

export default class SpeechAdapter {

    constructor(container) {
        adapter.init(container);

        this.greeting = new Mumble({
            language: 'ru-RU',
            continuous: false,
            autoRestart: true,
            debug: false,

            commands: commands.greeting
        });
    }

    waitGreeeting() {
        // this.greeting.start();
        return this;
    }

    stopGreeting() {
        this.greeting.stop();
        return this;
    }

}


/*


// if using node.js, else leave out
 
// for all options, see the docs
let mumble;

const welcome = () => {
    mumble = 

    mumble.start();
}

// welcome();

const setUserName = () => {
    mumble = new Mumble({
        language: 'ru-RU',
        continuous: false,
        autoRestart: true,
        debug: false,

        commands: [
            {
                name: 'name',
                command: /^(меня зовут|я) (.+)/,
                action: (predicate, userName) => {
                    console.log(`Hello, ${userName}!`);
                }
            }
        ]
    });

    mumble.start();
}

// setUserName();

const setTwitterAccount = () => {
    mumble = new Mumble({
        language: 'en-US',
        continuous: false,
        autoRestart: true,
        debug: false,

        commands: [
            {
                name: 'back',
                command: /^back/,
                action: () => {
                    console.log('Trying to back.');
                }
            },
            {
                name: 'underscore',
                command: /^underscore/,
                action: () => {
                    console.log('Letter: _;');
                }
            },
            {
                name: 'letter',
                command: /^([a-zA-Z0-9]{1})/,
                action: (letter) => {
                    console.log(`word: ${letter};`);
                }
            },
            {
                name: 'next',
                command: /^next/,
                action: () => {
                    console.log('Dismiss twitter validation');
                }
            }
        ],

        callbacks: {
             speech: ({ results }) => {
                let recognized = results[results.length - 1];
                for (let i = 0; i < recognized.length; i++) {
                    console.log(recognized[i].transcript);
                }
                console.log('-------');
            }
        }
    });

    mumble.start();

}

// setTwitterAccount();

const listenCommands = () => {
    mumble = new Mumble({
        language: 'ru-RU',
        continuous: false,
        autoRestart: true,
        debug: false,

        commands: [
            {
                name: 'weather_city_day',
                command: /погода в (.+) (сегодня|завтра)$/,
                action: (city, day) => {
                    console.log(`Trying to get weather: ${city} and ${day}`);
                }
            },
            {
                name: 'weather_city_day_of_weak',
                command: /погода в (.+) (в|во) (понедельник|вторник|среду|четверг|пятницу|субботу|воскресенье)$/,
                action: (city, predicate, day) => {
                    console.log(`Trying to get weather: ${city} at ${day}`);
                }
            },
            {
                name: 'weather_city',
                command: /^погода в (.+)/,
                action: (city) => {
                    console.log(`Trying to get weather: ${city}`);
                }
            },
            {
                name: 'weather_day_city',
                command: /^погода (сегодня|завтра) в (.+)/,
                action: (day, city) => {
                    console.log(`Trying to get weather: ${day}: _${city}`);
                }
            },
            {
                name: 'play',
                command: /^(проигра(ть|й)|открой) файл (.+)/,
                action: (command, ending, fileName) => {
                    console.log(`Trying to play: "${fileName.toLowerCase().replace(/ /g,'')}"`);
                }
            },
            {
                name: 'stop',
                command: /^(останов(и|ить)|прекрат(и|ить)) проигрывание ?(файла)?/,
                action: (command) => {
                    console.log('Trying to stop playout');
                }
            },
            {
                name: 'open_web_page',
                command: /^откр(ыть|ой) (сайт|страницу) (.+)/,
                action: (ending, webpage, fileName) => {
                    console.log(`Trying to open: "${fileName}"`);
                }
            },
            {
                name: 'open',
                command: /^откр(ыть|ой) (.+)/,
                action: (ending, fileName) => {
                    console.log(`Generic open: "${fileName}"`);
                }
            },
            {
                name: 'show_tweets',
                command: /^(покажи|отобраз(и|ить)) ?(мои)? (твиты)/,
                action: (webpage, fileName) => {
                    console.log('Trying to show tweets');
                }
            },
            {
                name: 'disco',
                command: /(давай)? ?устро(им|й|ить) дискотеку$/,
                action: () => {
                    console.log('Let start disco!!!!!!!');
                }
            },
            {
                name: 'close_web_page',
                command: /^закрой (сайт|страницу) (.+)/,
                action: (webpage, fileName) => {
                    console.log(`Trying to close: "${fileName}"`);
                }
            },
            {
                name: 'time',
                command: /^(который (сейчас)? ?час)|(сколько (сейчас)? ?времени)/,
                action: () => {
                    console.log(new Date());
                }
            },
            {
                name: 'end',
                command: /пока/,
                action: () => {
                    console.log('Good bye!');
                }
            }
        ],
     
        callbacks: {
            start: (event) => {
                console.log('Starting...');
            },

            end: () => {
                console.log('Ending...');
            },

            speech: ({ results }) => {
                let recognized = results[results.length - 1];
                for (let i = 0; i < recognized.length; i++) {
                    console.log(recognized[i].transcript);
                }
                console.log('-------');
            }
        }
    });

    mumble.start();
}

// listenCommands();


*/