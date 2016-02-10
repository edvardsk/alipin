import './styles/main.scss';

// if using node.js, else leave out
import Mumble from 'mumble-js';
 
// for all options, see the docs
const mumble = new Mumble({
    language: 'ru-RU',
    continuous: true,
    autoRestart: true,
    debug: false, // set to true to get some detailed information about what's going on
 
    // define some commands using regex or a simple string for exact matching
    commands: [
    // {
    //     name: 'appointment',
    //     command: /^book (.+) for me (today|tomorrow) at (\d+)$/,
 
    //     action: (type, date, hour) => {
    //         console.log('Making an appointment for %s %s at %d', type, date, (hour - 0) );
    //     }
    // }, {
    //     name: 'google',
    //     command: /^google (.+) for me\s?(please)?$/,
 
    //     action: (query, polite) => {
    //         if (polite) {
    //             // google the query
    //         } else {
    //             console.log('I will google that for you but only if you say please');
    //         }
    //     }
    // }
        {
            name: 'play',
            command: /проиграй файл (.+)/,
            action: (fileName) => {
                console.log(`Trying to play: "${fileName}"`);
            }
        },
        {
            name: 'time',
            command: /который (сейчас) час/,
            action: () => {
                console.log(new Date());
            }
        }
    ],
 
    // define global callbacks (see docs for all)
    callbacks: {
        start: (event) => {
            console.log('Starting..');
        },
 
        speech: ({ results }) => {
            for (let j = 0; j < results.length; j++) {
                let recognized = results[j];
                for (let i = 0; i < recognized.length; i++) {
                    console.log(recognized[i].transcript);
                }
            }
            console.log('-------');
        }
    }
});
 

// start listening
mumble.start();