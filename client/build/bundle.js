/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var _mumbleJs = __webpack_require__(5);

	var _mumbleJs2 = _interopRequireDefault(_mumbleJs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// for all options, see the docs
	var mumble = new _mumbleJs2.default({
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
	        action: function action(fileName) {
	            console.log('Trying to play: "' + fileName + '"');
	        }
	    }, {
	        name: 'time',
	        command: /который (сейчас) час/,
	        action: function action() {
	            console.log(new Date());
	        }
	    }],

	    // define global callbacks (see docs for all)
	    callbacks: {
	        start: function start(event) {
	            console.log('Starting..');
	        },

	        speech: function speech(_ref) {
	            var results = _ref.results;

	            for (var j = 0; j < results.length; j++) {
	                var recognized = results[j];
	                for (var i = 0; i < recognized.length; i++) {
	                    console.log(recognized[i].transcript);
	                }
	            }
	            console.log('-------');
	        }
	    }
	});

	// start listening


	// if using node.js, else leave out
		mumble.start();

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*!*
	 * mumble.js v1.0.1
	 * https://github.com/swemaniac/mumble
	 *
	 * A simple framework for adding voice commands to a web site using the web speech recognition API.
	 * Supports the CommonJs/node.js/AMD and global syntax.
	 *
	 * See https://github.com/swemaniac/mumble for a readme and some examples.
	 * Forked from and inspired by https://github.com/TalAter/annyang.
	 */

	/**
	 * Definition of a speech callback.
	 *
	 * @callback SpeechCallback
	 * @param {event} event The original event object.
	 */

	/**
	 * Definition of a command object.
	 *
	 * @typedef {object} Command
	 *
	 * @property {string} name The command identifier.
	 * @property {string|RegExp} command The command in regex form (can be string or object).
	 * @property {function} action A callback that will be run when the command matches speech with the matched parameters.
	 */

	/**
	 * Definition of an options object.
	 *
	 * @typedef {object} Options
	 *
	 * @property {string} [language=en-US] A 4-letter language code, e.g. en-US.
	 * @property {boolean} [autoRestart=true] Whether to allow auto restarting the speech recognizer.
	 * @property {boolean} [continuous] Whether the speech recognizer should act as a dictation device.
	 * @property {integer} [maxAlternatives=5] The max number of alternative transcripts from the speech recognizer (defaults to 5).
	 * @property {boolean} [debug=false] Whether to enable debug logging.
	 * @property {Command[]} [commands] An array of commands, can also be added with addCommand().
	 * @property {SpeechCallback[]} [callbacks] An object describing various callbacks to events (start, end, speech, recognizeMatch, recognizeNoMatch, error).
	 */

	(function (name, definition) {
		if (true) module.exports = definition();else if (typeof define == 'function' && _typeof(define.amd) == 'object') define(definition);else this[name] = definition();
	})('Mumble',
	/**
	 * Module mumble.
	 * @module mumble
	 */
	function () {
		"use strict";

		/**
	  * Module entrypoint/constructor.
	  *
	  * @constructor
	  * @alias module:mumble
	  *
	  * @param {Options} options An options object.
	  */
	
		var Mumble = function Mumble(options) {
			var _recognizer = null;
			var _startTime = 0;
			var _aborted = false;
			var _commands = [];

			var _options = {
				language: 'en-US',
				autoRestart: true,
				continuous: window.location.protocol === 'http:',
				maxAlternatives: 5,
				debug: false,

				commands: [],

				callbacks: {
					start: null,
					end: null,
					speech: null,
					recognizeMatch: null,
					recognizeNoMatch: null,
					error: null
				}
			};

			var _self = this;

			/**
	   * Call to start listening for speech.
	   * @throws If the SpeechRecognition object wasn't supported.
	   */
			this.start = function () {
				if (!this.isAvailable()) {
					throw 'Speech recognition not supported in this browser';
				}

				_aborted = false;
				_startTime = new Date().getTime();

				_log('Starting with %d command(s) active', _commands.length);

				_recognizer.start();
			};

			/**
	   * Call to stop listening for speech.
	   */
			this.stop = function () {
				if (this.isAvailable()) {
					_aborted = true;
					_recognizer.abort();
				}
			};

			/**
	   * Check if the SpeechRecognition object is supported.
	   * @return {boolean}
	   */
			this.isAvailable = function () {
				return !!_recognizer;
			};

			/**
	   * Gets a reference to the SpeechRecognition object.
	   * @return {SpeechRecognition}
	   */
			this.getSpeechRecognitionObject = function () {
				return _recognizer;
			};

			/**
	   * Adds a command.
	   *
	   * The command syntax can be a string with or without any regex instructions,
	   * or a RegExp object. Either way it will be converted to a RegExp object with
	   * the ignoreCase flag set.
	   *
	   * **Example**
	   *
	   * `addCommand('appointment', /^book (.+) for me (today|tomorrow) at (\d+)$/, function(appointment, date, hour) { })`
	   *
	   * @param {string} name A command identifier.
	   * @param {string|RegExp} command The command in regex form (can be string or object).
	   * @param {function} action A callback that will be run when the command matches speech.
	   *
	   * @throws If a command with the same name already exists.
	   */
			this.addCommand = function (name, command, action) {
				if (this.getCommand(name)) {
					throw 'Command "' + name + '"" already exists';
				}

				// wrap the command in a RegExp object with the ignoreCase flag
				var commandSrc = typeof command == 'string' ? '^' + command + '$' : command.source;
				var commandExp = new RegExp(commandSrc, 'i');

				_commands.push({
					name: name,
					command: commandExp,
					action: action
				});

				_log('Added command: "%s", %s', name, commandExp);
			};

			/**
	   * Removes a command.
	   * @param {string} name The command identifier.
	   */
			this.removeCommand = function (name) {
				var foundIndex = -1;

				_commands.some(function (command, index) {
					if (command.name == name) {
						foundIndex = index;
						return true;
					}

					return false;
				});

				if (foundIndex >= 0) {
					delete _commands[foundIndex];
					_log('Removed command "%s"', name);
				}
			};

			/**
	   * Gets a previously added command.
	   *
	   * @param {string} name A command identifier.
	   * @return {Command} A command.
	   */
			this.getCommand = function (name) {
				var found = null;

				_commands.some(function (command) {
					if (command.name == name) {
						found = command;
						return true;
					}

					return false;
				});

				return found;
			};

			/**
	   * Sets the language of the speech recognizer.
	   * @param {string} language A 4 letter language code (e.g. en-US).
	   */
			this.setLanguage = function (language) {
				_options.language = language;

				if (this.isAvailable()) {
					_recognizer.lang = _options.language;
				}
			};

			/**
	   * Sets whether the speech recognizer should be auto restarted
	   * after an "end" event.
	   *
	   * @param {boolean} autoRestart
	   */
			this.setAutoRestart = function (autoRestart) {
				_options.autoRestart = !!autoRestart;
			};

			/**
	   * Sets the max number of alternative transcripts that the
	   * speech recognizer should return.
	   *
	   * Mumble will try to match a command to each of these transcripts.
	   *
	   * @param {integer} maxAlternatives
	   */
			this.setMaxAlternatives = function (maxAlternatives) {
				_options.maxAlternatives = parseInt(maxAlternatives);

				if (this.isAvailable()) {
					_recognizer.maxAlternatives = _options.maxAlternatives;
				}
			};

			/**
	   * Sets whether the speech recognizer should act as a dictation device or
	   * a one-shot command device.
	   *
	   * In HTTPS, turn off continuous mode for faster results.
	   * In HTTP, turn on continuous mode for much slower results, but no repeating security notices.
	   *
	   * @param {boolean} continuous The mode of the speech recognizer.
	   */
			this.setContinuous = function (continuous) {
				_options.continuous = !!continuous;

				if (this.isAvailable()) {
					_recognizer.continuous = _options.continuous;
				}
			};

			/**
	   * Enables or disabled debug logging to the console.
	   * @param {boolean} debug
	   */
			this.setDebug = function (debug) {
				_options.debug = !!debug;
			};

			function _init(options) {
				_recognizer = _getRecognizerObject();

				if (!_self.isAvailable()) {
					return;
				}

				// merge default options with user options
				if (options) {
					for (var opt in _options) {
						if (options[opt]) {
							_options[opt] = options[opt];
						}
					}
				}

				_self.setLanguage(_options.language);
				_self.setContinuous(_options.continuous);
				_self.setAutoRestart(_options.autoRestart);
				_self.setMaxAlternatives(_options.maxAlternatives);
				_self.setDebug(_options.debug);

				// add commands
				_options.commands.forEach(function (command) {
					_self.addCommand(command.name, command.command, command.action);
				});

				// set callbacks
				_recognizer.onstart = _onStart;
				_recognizer.onend = _onEnd;
				_recognizer.onerror = _onError;
				_recognizer.onresult = _onResult;
			}

			function _onStart(event) {
				_log('Start listening..', event, _options);
				_callback(_options.callbacks.start, event, _self);
			}

			function _onEnd(event) {
				_log('Stop listening..', event);
				_callback(_options.callbacks.end, event, _self);

				if (_options.autoRestart && !_aborted) {
					_log('(Auto-restarting)');

					var timeSinceLastStarted = new Date().getTime() - _startTime;

					// allow at least 1s between restarts
					if (timeSinceLastStarted < 1000) {
						setTimeout(_self.start, 1000 - timeSinceLastStarted);
					} else {
						_self.start();
					}
				}
			}

			function _onError(event) {
				_log('Error occurred', event);
				_callback(_options.callbacks.error, event, _self);

				if (['not-allowed', 'service-not-allowed'].indexOf(event.error) !== -1) {
					_self.setAutoRestart(false);
				}
			}

			function _onResult(event) {
				_log('Got result', event);
				_callback(_options.callbacks.speech, event, _self);

				var results = event.results[event.resultIndex];
				var matchFound = false;

				// loop through the transcription results
				for (var i = 0; i < results.length; i++) {
					var result = results[i];
					var transcript = result.transcript.trim();

					_log('Recognized: "%s"', transcript);

					// check each command against the transcript, halting on the first match
					matchFound = _commands.some(function (command) {
						var match = command.command.exec(transcript);

						// we got a match
						if (match) {
							var parameters = match.slice(1);

							_log('Command matched: "%s", %s', command.name, command.command, parameters);

							// call the generic callback and the command action with any possible parameters from the regex
							_callback(_options.callbacks.recognizeMatch, event, _self);
							command.action.apply(_self, parameters);

							return true;
						}

						return false;
					});

					// don't go through the rest of the commands on a match
					if (matchFound) {
						break;
					}
				}

				if (!matchFound) {
					_callback(_options.callbacks.recognizeNoMatch, event, _self);
				}

				return matchFound;
			}

			function _callback(callback, event, context) {
				if (typeof callback == 'function') {
					callback.call(context, event);
				}
			}

			function _getRecognizerObject() {
				var SpeechRecognizer = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;

				if (SpeechRecognizer) {
					return new SpeechRecognizer();
				}

				_log('SpeechRecognition object not supported');

				return null;
			}

			function _log() {
				if (!!_options.debug) {
					var out = window.console || { log: function log() {} };
					out.log.apply(out, arguments);
				}
			}

			_init(options);
		};

		return Mumble;
		});

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDY0MjBhYzMwY2VkMzc1ODg3Y2MyIiwid2VicGFjazovLy9jbGllbnQvc3JjL21haW4uZXMiLCJ3ZWJwYWNrOi8vLy4vc3R5bGVzL21haW4uc2NzcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL211bWJsZS1qcy9zcmMvbXVtYmxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNjQyMGFjMzBjZWQzNzU4ODdjYzJcbiAqKi8iLCJpbXBvcnQgJy4vc3R5bGVzL21haW4uc2Nzcyc7XG5cbi8vIGlmIHVzaW5nIG5vZGUuanMsIGVsc2UgbGVhdmUgb3V0XG5pbXBvcnQgTXVtYmxlIGZyb20gJ211bWJsZS1qcyc7XG4gXG4vLyBmb3IgYWxsIG9wdGlvbnMsIHNlZSB0aGUgZG9jc1xuY29uc3QgbXVtYmxlID0gbmV3IE11bWJsZSh7XG4gICAgbGFuZ3VhZ2U6ICdydS1SVScsXG4gICAgY29udGludW91czogdHJ1ZSxcbiAgICBhdXRvUmVzdGFydDogdHJ1ZSxcbiAgICBkZWJ1ZzogZmFsc2UsIC8vIHNldCB0byB0cnVlIHRvIGdldCBzb21lIGRldGFpbGVkIGluZm9ybWF0aW9uIGFib3V0IHdoYXQncyBnb2luZyBvblxuIFxuICAgIC8vIGRlZmluZSBzb21lIGNvbW1hbmRzIHVzaW5nIHJlZ2V4IG9yIGEgc2ltcGxlIHN0cmluZyBmb3IgZXhhY3QgbWF0Y2hpbmdcbiAgICBjb21tYW5kczogW1xuICAgIC8vIHtcbiAgICAvLyAgICAgbmFtZTogJ2FwcG9pbnRtZW50JyxcbiAgICAvLyAgICAgY29tbWFuZDogL15ib29rICguKykgZm9yIG1lICh0b2RheXx0b21vcnJvdykgYXQgKFxcZCspJC8sXG4gXG4gICAgLy8gICAgIGFjdGlvbjogKHR5cGUsIGRhdGUsIGhvdXIpID0+IHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdNYWtpbmcgYW4gYXBwb2ludG1lbnQgZm9yICVzICVzIGF0ICVkJywgdHlwZSwgZGF0ZSwgKGhvdXIgLSAwKSApO1xuICAgIC8vICAgICB9XG4gICAgLy8gfSwge1xuICAgIC8vICAgICBuYW1lOiAnZ29vZ2xlJyxcbiAgICAvLyAgICAgY29tbWFuZDogL15nb29nbGUgKC4rKSBmb3IgbWVcXHM/KHBsZWFzZSk/JC8sXG4gXG4gICAgLy8gICAgIGFjdGlvbjogKHF1ZXJ5LCBwb2xpdGUpID0+IHtcbiAgICAvLyAgICAgICAgIGlmIChwb2xpdGUpIHtcbiAgICAvLyAgICAgICAgICAgICAvLyBnb29nbGUgdGhlIHF1ZXJ5XG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJIHdpbGwgZ29vZ2xlIHRoYXQgZm9yIHlvdSBidXQgb25seSBpZiB5b3Ugc2F5IHBsZWFzZScpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncGxheScsXG4gICAgICAgICAgICBjb21tYW5kOiAv0L/RgNC+0LjQs9GA0LDQuSDRhNCw0LnQuyAoLispLyxcbiAgICAgICAgICAgIGFjdGlvbjogKGZpbGVOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFRyeWluZyB0byBwbGF5OiBcIiR7ZmlsZU5hbWV9XCJgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3RpbWUnLFxuICAgICAgICAgICAgY29tbWFuZDogL9C60L7RgtC+0YDRi9C5ICjRgdC10LnRh9Cw0YEpINGH0LDRgS8sXG4gICAgICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXcgRGF0ZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF0sXG4gXG4gICAgLy8gZGVmaW5lIGdsb2JhbCBjYWxsYmFja3MgKHNlZSBkb2NzIGZvciBhbGwpXG4gICAgY2FsbGJhY2tzOiB7XG4gICAgICAgIHN0YXJ0OiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTdGFydGluZy4uJyk7XG4gICAgICAgIH0sXG4gXG4gICAgICAgIHNwZWVjaDogKHsgcmVzdWx0cyB9KSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJlc3VsdHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVjb2duaXplZCA9IHJlc3VsdHNbal07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWNvZ25pemVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlY29nbml6ZWRbaV0udHJhbnNjcmlwdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0nKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIFxuXG4vLyBzdGFydCBsaXN0ZW5pbmdcbm11bWJsZS5zdGFydCgpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIGNsaWVudC9zcmMvbWFpbi5lc1xuICoqLyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3N0eWxlcy9tYWluLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKiEqXHJcbiAqIG11bWJsZS5qcyB2MS4wLjFcclxuICogaHR0cHM6Ly9naXRodWIuY29tL3N3ZW1hbmlhYy9tdW1ibGVcclxuICpcclxuICogQSBzaW1wbGUgZnJhbWV3b3JrIGZvciBhZGRpbmcgdm9pY2UgY29tbWFuZHMgdG8gYSB3ZWIgc2l0ZSB1c2luZyB0aGUgd2ViIHNwZWVjaCByZWNvZ25pdGlvbiBBUEkuXHJcbiAqIFN1cHBvcnRzIHRoZSBDb21tb25Kcy9ub2RlLmpzL0FNRCBhbmQgZ2xvYmFsIHN5bnRheC5cclxuICpcclxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VtYW5pYWMvbXVtYmxlIGZvciBhIHJlYWRtZSBhbmQgc29tZSBleGFtcGxlcy5cclxuICogRm9ya2VkIGZyb20gYW5kIGluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9UYWxBdGVyL2FubnlhbmcuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIERlZmluaXRpb24gb2YgYSBzcGVlY2ggY2FsbGJhY2suXHJcbiAqXHJcbiAqIEBjYWxsYmFjayBTcGVlY2hDYWxsYmFja1xyXG4gKiBAcGFyYW0ge2V2ZW50fSBldmVudCBUaGUgb3JpZ2luYWwgZXZlbnQgb2JqZWN0LlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBEZWZpbml0aW9uIG9mIGEgY29tbWFuZCBvYmplY3QuXHJcbiAqXHJcbiAqIEB0eXBlZGVmIHtvYmplY3R9IENvbW1hbmRcclxuICpcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUgVGhlIGNvbW1hbmQgaWRlbnRpZmllci5cclxuICogQHByb3BlcnR5IHtzdHJpbmd8UmVnRXhwfSBjb21tYW5kIFRoZSBjb21tYW5kIGluIHJlZ2V4IGZvcm0gKGNhbiBiZSBzdHJpbmcgb3Igb2JqZWN0KS5cclxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gYWN0aW9uIEEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIHJ1biB3aGVuIHRoZSBjb21tYW5kIG1hdGNoZXMgc3BlZWNoIHdpdGggdGhlIG1hdGNoZWQgcGFyYW1ldGVycy5cclxuICovXHJcblxyXG4vKipcclxuICogRGVmaW5pdGlvbiBvZiBhbiBvcHRpb25zIG9iamVjdC5cclxuICpcclxuICogQHR5cGVkZWYge29iamVjdH0gT3B0aW9uc1xyXG4gKlxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2xhbmd1YWdlPWVuLVVTXSBBIDQtbGV0dGVyIGxhbmd1YWdlIGNvZGUsIGUuZy4gZW4tVVMuXHJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2F1dG9SZXN0YXJ0PXRydWVdIFdoZXRoZXIgdG8gYWxsb3cgYXV0byByZXN0YXJ0aW5nIHRoZSBzcGVlY2ggcmVjb2duaXplci5cclxuICogQHByb3BlcnR5IHtib29sZWFufSBbY29udGludW91c10gV2hldGhlciB0aGUgc3BlZWNoIHJlY29nbml6ZXIgc2hvdWxkIGFjdCBhcyBhIGRpY3RhdGlvbiBkZXZpY2UuXHJcbiAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0gW21heEFsdGVybmF0aXZlcz01XSBUaGUgbWF4IG51bWJlciBvZiBhbHRlcm5hdGl2ZSB0cmFuc2NyaXB0cyBmcm9tIHRoZSBzcGVlY2ggcmVjb2duaXplciAoZGVmYXVsdHMgdG8gNSkuXHJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2RlYnVnPWZhbHNlXSBXaGV0aGVyIHRvIGVuYWJsZSBkZWJ1ZyBsb2dnaW5nLlxyXG4gKiBAcHJvcGVydHkge0NvbW1hbmRbXX0gW2NvbW1hbmRzXSBBbiBhcnJheSBvZiBjb21tYW5kcywgY2FuIGFsc28gYmUgYWRkZWQgd2l0aCBhZGRDb21tYW5kKCkuXHJcbiAqIEBwcm9wZXJ0eSB7U3BlZWNoQ2FsbGJhY2tbXX0gW2NhbGxiYWNrc10gQW4gb2JqZWN0IGRlc2NyaWJpbmcgdmFyaW91cyBjYWxsYmFja3MgdG8gZXZlbnRzIChzdGFydCwgZW5kLCBzcGVlY2gsIHJlY29nbml6ZU1hdGNoLCByZWNvZ25pemVOb01hdGNoLCBlcnJvcikuXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKG5hbWUsIGRlZmluaXRpb24pIHtcclxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XHJcblx0ZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnKSBkZWZpbmUoZGVmaW5pdGlvbik7XHJcblx0ZWxzZSB0aGlzW25hbWVdID0gZGVmaW5pdGlvbigpO1xyXG59KCdNdW1ibGUnLFxyXG5cdC8qKlxyXG5cdCAqIE1vZHVsZSBtdW1ibGUuXHJcblx0ICogQG1vZHVsZSBtdW1ibGVcclxuXHQgKi9cclxuXHRmdW5jdGlvbigpIHtcclxuXHRcdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogTW9kdWxlIGVudHJ5cG9pbnQvY29uc3RydWN0b3IuXHJcblx0XHQgKlxyXG5cdFx0ICogQGNvbnN0cnVjdG9yXHJcblx0XHQgKiBAYWxpYXMgbW9kdWxlOm11bWJsZVxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9ucyBBbiBvcHRpb25zIG9iamVjdC5cclxuXHRcdCAqL1xyXG5cdFx0dmFyIE11bWJsZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdFx0dmFyIF9yZWNvZ25pemVyID0gbnVsbDtcclxuXHRcdFx0dmFyIF9zdGFydFRpbWUgPSAwO1xyXG5cdFx0XHR2YXIgX2Fib3J0ZWQgPSBmYWxzZTtcclxuXHRcdFx0dmFyIF9jb21tYW5kcyA9IFtdO1xyXG5cclxuXHRcdFx0dmFyIF9vcHRpb25zID0ge1xyXG5cdFx0XHRcdGxhbmd1YWdlOiAnZW4tVVMnLFxyXG5cdFx0XHRcdGF1dG9SZXN0YXJ0OiB0cnVlLFxyXG5cdFx0XHRcdGNvbnRpbnVvdXM6IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6JyxcclxuXHRcdFx0XHRtYXhBbHRlcm5hdGl2ZXM6IDUsXHJcblx0XHRcdFx0ZGVidWc6IGZhbHNlLFxyXG5cclxuXHRcdFx0XHRjb21tYW5kczogW1xyXG5cclxuXHRcdFx0XHRdLFxyXG5cclxuXHRcdFx0XHRjYWxsYmFja3M6IHtcclxuXHRcdFx0XHRcdHN0YXJ0OiBudWxsLFxyXG5cdFx0XHRcdFx0ZW5kOiBudWxsLFxyXG5cdFx0XHRcdFx0c3BlZWNoOiBudWxsLFxyXG5cdFx0XHRcdFx0cmVjb2duaXplTWF0Y2g6IG51bGwsXHJcblx0XHRcdFx0XHRyZWNvZ25pemVOb01hdGNoOiBudWxsLFxyXG5cdFx0XHRcdFx0ZXJyb3I6IG51bGxcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR2YXIgX3NlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0LyoqXHJcblx0XHRcdCAqIENhbGwgdG8gc3RhcnQgbGlzdGVuaW5nIGZvciBzcGVlY2guXHJcblx0XHRcdCAqIEB0aHJvd3MgSWYgdGhlIFNwZWVjaFJlY29nbml0aW9uIG9iamVjdCB3YXNuJ3Qgc3VwcG9ydGVkLlxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5zdGFydCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICghdGhpcy5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHR0aHJvdyAnU3BlZWNoIHJlY29nbml0aW9uIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdF9hYm9ydGVkID0gZmFsc2U7XHJcblx0XHRcdFx0X3N0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuXHRcdFx0XHRfbG9nKCdTdGFydGluZyB3aXRoICVkIGNvbW1hbmQocykgYWN0aXZlJywgX2NvbW1hbmRzLmxlbmd0aCk7XHJcblxyXG5cdFx0XHRcdF9yZWNvZ25pemVyLnN0YXJ0KCk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogQ2FsbCB0byBzdG9wIGxpc3RlbmluZyBmb3Igc3BlZWNoLlxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5zdG9wID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0X2Fib3J0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0X3JlY29nbml6ZXIuYWJvcnQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogQ2hlY2sgaWYgdGhlIFNwZWVjaFJlY29nbml0aW9uIG9iamVjdCBpcyBzdXBwb3J0ZWQuXHJcblx0XHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59XHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmlzQXZhaWxhYmxlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuICEhX3JlY29nbml6ZXI7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogR2V0cyBhIHJlZmVyZW5jZSB0byB0aGUgU3BlZWNoUmVjb2duaXRpb24gb2JqZWN0LlxyXG5cdFx0XHQgKiBAcmV0dXJuIHtTcGVlY2hSZWNvZ25pdGlvbn1cclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuZ2V0U3BlZWNoUmVjb2duaXRpb25PYmplY3QgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gX3JlY29nbml6ZXI7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogQWRkcyBhIGNvbW1hbmQuXHJcblx0XHRcdCAqXHJcblx0XHRcdCAqIFRoZSBjb21tYW5kIHN5bnRheCBjYW4gYmUgYSBzdHJpbmcgd2l0aCBvciB3aXRob3V0IGFueSByZWdleCBpbnN0cnVjdGlvbnMsXHJcblx0XHRcdCAqIG9yIGEgUmVnRXhwIG9iamVjdC4gRWl0aGVyIHdheSBpdCB3aWxsIGJlIGNvbnZlcnRlZCB0byBhIFJlZ0V4cCBvYmplY3Qgd2l0aFxyXG5cdFx0XHQgKiB0aGUgaWdub3JlQ2FzZSBmbGFnIHNldC5cclxuXHRcdFx0ICpcclxuXHRcdFx0ICogKipFeGFtcGxlKipcclxuXHRcdFx0ICpcclxuXHRcdFx0ICogYGFkZENvbW1hbmQoJ2FwcG9pbnRtZW50JywgL15ib29rICguKykgZm9yIG1lICh0b2RheXx0b21vcnJvdykgYXQgKFxcZCspJC8sIGZ1bmN0aW9uKGFwcG9pbnRtZW50LCBkYXRlLCBob3VyKSB7IH0pYFxyXG5cdFx0XHQgKlxyXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBBIGNvbW1hbmQgaWRlbnRpZmllci5cclxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBjb21tYW5kIFRoZSBjb21tYW5kIGluIHJlZ2V4IGZvcm0gKGNhbiBiZSBzdHJpbmcgb3Igb2JqZWN0KS5cclxuXHRcdFx0ICogQHBhcmFtIHtmdW5jdGlvbn0gYWN0aW9uIEEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIHJ1biB3aGVuIHRoZSBjb21tYW5kIG1hdGNoZXMgc3BlZWNoLlxyXG5cdFx0XHQgKlxyXG5cdFx0XHQgKiBAdGhyb3dzIElmIGEgY29tbWFuZCB3aXRoIHRoZSBzYW1lIG5hbWUgYWxyZWFkeSBleGlzdHMuXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmFkZENvbW1hbmQgPSBmdW5jdGlvbihuYW1lLCBjb21tYW5kLCBhY3Rpb24pIHtcclxuXHRcdFx0XHRpZiAodGhpcy5nZXRDb21tYW5kKG5hbWUpKSB7XHJcblx0XHRcdFx0XHR0aHJvdyAnQ29tbWFuZCBcIicgKyBuYW1lICsgJ1wiXCIgYWxyZWFkeSBleGlzdHMnO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gd3JhcCB0aGUgY29tbWFuZCBpbiBhIFJlZ0V4cCBvYmplY3Qgd2l0aCB0aGUgaWdub3JlQ2FzZSBmbGFnXHJcblx0XHRcdFx0dmFyIGNvbW1hbmRTcmMgPSB0eXBlb2YoY29tbWFuZCkgPT0gJ3N0cmluZycgPyAoJ14nICsgY29tbWFuZCArICckJykgOiBjb21tYW5kLnNvdXJjZTtcclxuXHRcdFx0XHR2YXIgY29tbWFuZEV4cCA9IG5ldyBSZWdFeHAoY29tbWFuZFNyYywgJ2knKTtcclxuXHJcblx0XHRcdFx0X2NvbW1hbmRzLnB1c2goe1xyXG5cdFx0XHRcdFx0bmFtZTogbmFtZSxcclxuXHRcdFx0XHRcdGNvbW1hbmQ6IGNvbW1hbmRFeHAsXHJcblx0XHRcdFx0XHRhY3Rpb246IGFjdGlvblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRfbG9nKCdBZGRlZCBjb21tYW5kOiBcIiVzXCIsICVzJywgbmFtZSwgY29tbWFuZEV4cCk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogUmVtb3ZlcyBhIGNvbW1hbmQuXHJcblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBjb21tYW5kIGlkZW50aWZpZXIuXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLnJlbW92ZUNvbW1hbmQgPSBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRcdFx0dmFyIGZvdW5kSW5kZXggPSAtMTtcclxuXHJcblx0XHRcdFx0X2NvbW1hbmRzLnNvbWUoZnVuY3Rpb24oY29tbWFuZCwgaW5kZXgpIHtcclxuXHRcdFx0XHRcdGlmIChjb21tYW5kLm5hbWUgPT0gbmFtZSkge1xyXG5cdFx0XHRcdFx0XHRmb3VuZEluZGV4ID0gaW5kZXg7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0aWYgKGZvdW5kSW5kZXggPj0gMCkge1xyXG5cdFx0XHRcdFx0ZGVsZXRlIF9jb21tYW5kc1tmb3VuZEluZGV4XTtcclxuXHRcdFx0XHRcdF9sb2coJ1JlbW92ZWQgY29tbWFuZCBcIiVzXCInLCBuYW1lKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogR2V0cyBhIHByZXZpb3VzbHkgYWRkZWQgY29tbWFuZC5cclxuXHRcdFx0ICpcclxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgQSBjb21tYW5kIGlkZW50aWZpZXIuXHJcblx0XHRcdCAqIEByZXR1cm4ge0NvbW1hbmR9IEEgY29tbWFuZC5cclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuZ2V0Q29tbWFuZCA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdFx0XHR2YXIgZm91bmQgPSBudWxsO1xyXG5cclxuXHRcdFx0XHRfY29tbWFuZHMuc29tZShmdW5jdGlvbihjb21tYW5kKSB7XHJcblx0XHRcdFx0XHRpZiAoY29tbWFuZC5uYW1lID09IG5hbWUpIHtcclxuXHRcdFx0XHRcdFx0Zm91bmQgPSBjb21tYW5kO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHJldHVybiBmb3VuZDtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8qKlxyXG5cdFx0XHQgKiBTZXRzIHRoZSBsYW5ndWFnZSBvZiB0aGUgc3BlZWNoIHJlY29nbml6ZXIuXHJcblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZSBBIDQgbGV0dGVyIGxhbmd1YWdlIGNvZGUgKGUuZy4gZW4tVVMpLlxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5zZXRMYW5ndWFnZSA9IGZ1bmN0aW9uKGxhbmd1YWdlKSB7XHJcblx0XHRcdFx0X29wdGlvbnMubGFuZ3VhZ2UgPSBsYW5ndWFnZTtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0X3JlY29nbml6ZXIubGFuZyA9IF9vcHRpb25zLmxhbmd1YWdlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8qKlxyXG5cdFx0XHQgKiBTZXRzIHdoZXRoZXIgdGhlIHNwZWVjaCByZWNvZ25pemVyIHNob3VsZCBiZSBhdXRvIHJlc3RhcnRlZFxyXG5cdFx0XHQgKiBhZnRlciBhbiBcImVuZFwiIGV2ZW50LlxyXG5cdFx0XHQgKlxyXG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IGF1dG9SZXN0YXJ0XHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLnNldEF1dG9SZXN0YXJ0ID0gZnVuY3Rpb24oYXV0b1Jlc3RhcnQpIHtcclxuXHRcdFx0XHRfb3B0aW9ucy5hdXRvUmVzdGFydCA9ICEhYXV0b1Jlc3RhcnQ7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogU2V0cyB0aGUgbWF4IG51bWJlciBvZiBhbHRlcm5hdGl2ZSB0cmFuc2NyaXB0cyB0aGF0IHRoZVxyXG5cdFx0XHQgKiBzcGVlY2ggcmVjb2duaXplciBzaG91bGQgcmV0dXJuLlxyXG5cdFx0XHQgKlxyXG5cdFx0XHQgKiBNdW1ibGUgd2lsbCB0cnkgdG8gbWF0Y2ggYSBjb21tYW5kIHRvIGVhY2ggb2YgdGhlc2UgdHJhbnNjcmlwdHMuXHJcblx0XHRcdCAqXHJcblx0XHRcdCAqIEBwYXJhbSB7aW50ZWdlcn0gbWF4QWx0ZXJuYXRpdmVzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLnNldE1heEFsdGVybmF0aXZlcyA9IGZ1bmN0aW9uKG1heEFsdGVybmF0aXZlcykge1xyXG5cdFx0XHRcdF9vcHRpb25zLm1heEFsdGVybmF0aXZlcyA9IHBhcnNlSW50KG1heEFsdGVybmF0aXZlcyk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmlzQXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRcdF9yZWNvZ25pemVyLm1heEFsdGVybmF0aXZlcyA9IF9vcHRpb25zLm1heEFsdGVybmF0aXZlcztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogU2V0cyB3aGV0aGVyIHRoZSBzcGVlY2ggcmVjb2duaXplciBzaG91bGQgYWN0IGFzIGEgZGljdGF0aW9uIGRldmljZSBvclxyXG5cdFx0XHQgKiBhIG9uZS1zaG90IGNvbW1hbmQgZGV2aWNlLlxyXG5cdFx0XHQgKlxyXG5cdFx0XHQgKiBJbiBIVFRQUywgdHVybiBvZmYgY29udGludW91cyBtb2RlIGZvciBmYXN0ZXIgcmVzdWx0cy5cclxuXHRcdFx0ICogSW4gSFRUUCwgdHVybiBvbiBjb250aW51b3VzIG1vZGUgZm9yIG11Y2ggc2xvd2VyIHJlc3VsdHMsIGJ1dCBubyByZXBlYXRpbmcgc2VjdXJpdHkgbm90aWNlcy5cclxuXHRcdFx0ICpcclxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFufSBjb250aW51b3VzIFRoZSBtb2RlIG9mIHRoZSBzcGVlY2ggcmVjb2duaXplci5cclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuc2V0Q29udGludW91cyA9IGZ1bmN0aW9uKGNvbnRpbnVvdXMpIHtcclxuXHRcdFx0XHRfb3B0aW9ucy5jb250aW51b3VzID0gISFjb250aW51b3VzO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHRfcmVjb2duaXplci5jb250aW51b3VzID0gX29wdGlvbnMuY29udGludW91cztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogRW5hYmxlcyBvciBkaXNhYmxlZCBkZWJ1ZyBsb2dnaW5nIHRvIHRoZSBjb25zb2xlLlxyXG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IGRlYnVnXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLnNldERlYnVnID0gZnVuY3Rpb24oZGVidWcpIHtcclxuXHRcdFx0XHRfb3B0aW9ucy5kZWJ1ZyA9ICEhZGVidWc7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBfaW5pdChvcHRpb25zKSB7XHJcblx0XHRcdFx0X3JlY29nbml6ZXIgPSBfZ2V0UmVjb2duaXplck9iamVjdCgpO1xyXG5cclxuXHRcdFx0XHRpZiAoIV9zZWxmLmlzQXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIG1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHVzZXIgb3B0aW9uc1xyXG5cdFx0XHRcdGlmIChvcHRpb25zKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBvcHQgaW4gX29wdGlvbnMpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnNbb3B0XSkge1xyXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zW29wdF0gPSBvcHRpb25zW29wdF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdF9zZWxmLnNldExhbmd1YWdlKF9vcHRpb25zLmxhbmd1YWdlKTtcclxuXHRcdFx0XHRfc2VsZi5zZXRDb250aW51b3VzKF9vcHRpb25zLmNvbnRpbnVvdXMpO1xyXG5cdFx0XHRcdF9zZWxmLnNldEF1dG9SZXN0YXJ0KF9vcHRpb25zLmF1dG9SZXN0YXJ0KTtcclxuXHRcdFx0XHRfc2VsZi5zZXRNYXhBbHRlcm5hdGl2ZXMoX29wdGlvbnMubWF4QWx0ZXJuYXRpdmVzKTtcclxuXHRcdFx0XHRfc2VsZi5zZXREZWJ1Zyhfb3B0aW9ucy5kZWJ1Zyk7XHJcblxyXG5cdFx0XHRcdC8vIGFkZCBjb21tYW5kc1xyXG5cdFx0XHRcdF9vcHRpb25zLmNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24oY29tbWFuZCkge1xyXG5cdFx0XHRcdFx0X3NlbGYuYWRkQ29tbWFuZChjb21tYW5kLm5hbWUsIGNvbW1hbmQuY29tbWFuZCwgY29tbWFuZC5hY3Rpb24pO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQvLyBzZXQgY2FsbGJhY2tzXHJcblx0XHRcdFx0X3JlY29nbml6ZXIub25zdGFydCA9IF9vblN0YXJ0O1xyXG5cdFx0XHRcdF9yZWNvZ25pemVyLm9uZW5kID0gX29uRW5kO1xyXG5cdFx0XHRcdF9yZWNvZ25pemVyLm9uZXJyb3IgPSBfb25FcnJvcjtcclxuXHRcdFx0XHRfcmVjb2duaXplci5vbnJlc3VsdCA9IF9vblJlc3VsdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gX29uU3RhcnQoZXZlbnQpIHtcclxuXHRcdFx0XHRfbG9nKCdTdGFydCBsaXN0ZW5pbmcuLicsIGV2ZW50LCBfb3B0aW9ucyk7XHJcblx0XHRcdFx0X2NhbGxiYWNrKF9vcHRpb25zLmNhbGxiYWNrcy5zdGFydCwgZXZlbnQsIF9zZWxmKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gX29uRW5kKGV2ZW50KSB7XHJcblx0XHRcdFx0X2xvZygnU3RvcCBsaXN0ZW5pbmcuLicsIGV2ZW50KTtcclxuXHRcdFx0XHRfY2FsbGJhY2soX29wdGlvbnMuY2FsbGJhY2tzLmVuZCwgZXZlbnQsIF9zZWxmKTtcclxuXHJcblx0XHRcdFx0aWYgKF9vcHRpb25zLmF1dG9SZXN0YXJ0ICYmICFfYWJvcnRlZCkge1xyXG5cdFx0XHRcdFx0X2xvZygnKEF1dG8tcmVzdGFydGluZyknKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgdGltZVNpbmNlTGFzdFN0YXJ0ZWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIF9zdGFydFRpbWU7XHJcblxyXG5cdFx0XHRcdFx0Ly8gYWxsb3cgYXQgbGVhc3QgMXMgYmV0d2VlbiByZXN0YXJ0c1xyXG5cdFx0XHRcdFx0aWYgKHRpbWVTaW5jZUxhc3RTdGFydGVkIDwgMTAwMCkge1xyXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KF9zZWxmLnN0YXJ0LCAxMDAwIC0gdGltZVNpbmNlTGFzdFN0YXJ0ZWQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0X3NlbGYuc3RhcnQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIF9vbkVycm9yKGV2ZW50KSB7XHJcblx0XHRcdFx0X2xvZygnRXJyb3Igb2NjdXJyZWQnLCBldmVudCk7XHJcblx0XHRcdFx0X2NhbGxiYWNrKF9vcHRpb25zLmNhbGxiYWNrcy5lcnJvciwgZXZlbnQsIF9zZWxmKTtcclxuXHJcblx0XHRcdFx0aWYgKFsnbm90LWFsbG93ZWQnLCAnc2VydmljZS1ub3QtYWxsb3dlZCddLmluZGV4T2YoZXZlbnQuZXJyb3IpICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0X3NlbGYuc2V0QXV0b1Jlc3RhcnQoZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gX29uUmVzdWx0KGV2ZW50KSB7XHJcblx0XHRcdFx0X2xvZygnR290IHJlc3VsdCcsIGV2ZW50KTtcclxuXHRcdFx0XHRfY2FsbGJhY2soX29wdGlvbnMuY2FsbGJhY2tzLnNwZWVjaCwgZXZlbnQsIF9zZWxmKTtcclxuXHJcblx0XHRcdFx0dmFyIHJlc3VsdHMgPSBldmVudC5yZXN1bHRzW2V2ZW50LnJlc3VsdEluZGV4XTtcclxuXHRcdFx0XHR2YXIgbWF0Y2hGb3VuZCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHQvLyBsb29wIHRocm91Z2ggdGhlIHRyYW5zY3JpcHRpb24gcmVzdWx0c1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dmFyIHJlc3VsdCA9IHJlc3VsdHNbaV07XHJcblx0XHRcdFx0XHR2YXIgdHJhbnNjcmlwdCA9IHJlc3VsdC50cmFuc2NyaXB0LnRyaW0oKTtcclxuXHJcblx0XHRcdFx0XHRfbG9nKCdSZWNvZ25pemVkOiBcIiVzXCInLCB0cmFuc2NyaXB0KTtcclxuXHJcblx0XHRcdFx0XHQvLyBjaGVjayBlYWNoIGNvbW1hbmQgYWdhaW5zdCB0aGUgdHJhbnNjcmlwdCwgaGFsdGluZyBvbiB0aGUgZmlyc3QgbWF0Y2hcclxuXHRcdFx0XHRcdG1hdGNoRm91bmQgPSBfY29tbWFuZHMuc29tZShmdW5jdGlvbihjb21tYW5kKSB7XHJcblx0XHRcdFx0XHRcdHZhciBtYXRjaCA9IGNvbW1hbmQuY29tbWFuZC5leGVjKHRyYW5zY3JpcHQpO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gd2UgZ290IGEgbWF0Y2hcclxuXHRcdFx0XHRcdFx0aWYgKG1hdGNoKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHBhcmFtZXRlcnMgPSBtYXRjaC5zbGljZSgxKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0X2xvZygnQ29tbWFuZCBtYXRjaGVkOiBcIiVzXCIsICVzJywgY29tbWFuZC5uYW1lLCBjb21tYW5kLmNvbW1hbmQsIHBhcmFtZXRlcnMpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBjYWxsIHRoZSBnZW5lcmljIGNhbGxiYWNrIGFuZCB0aGUgY29tbWFuZCBhY3Rpb24gd2l0aCBhbnkgcG9zc2libGUgcGFyYW1ldGVycyBmcm9tIHRoZSByZWdleFxyXG5cdFx0XHRcdFx0XHRcdF9jYWxsYmFjayhfb3B0aW9ucy5jYWxsYmFja3MucmVjb2duaXplTWF0Y2gsIGV2ZW50LCBfc2VsZik7XHJcblx0XHRcdFx0XHRcdFx0Y29tbWFuZC5hY3Rpb24uYXBwbHkoX3NlbGYsIHBhcmFtZXRlcnMpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gZG9uJ3QgZ28gdGhyb3VnaCB0aGUgcmVzdCBvZiB0aGUgY29tbWFuZHMgb24gYSBtYXRjaFxyXG5cdFx0XHRcdFx0aWYgKG1hdGNoRm91bmQpIHtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoIW1hdGNoRm91bmQpIHtcclxuXHRcdFx0XHRcdF9jYWxsYmFjayhfb3B0aW9ucy5jYWxsYmFja3MucmVjb2duaXplTm9NYXRjaCwgZXZlbnQsIF9zZWxmKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBtYXRjaEZvdW5kO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBfY2FsbGJhY2soY2FsbGJhY2ssIGV2ZW50LCBjb250ZXh0KSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZihjYWxsYmFjaykgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2suY2FsbChjb250ZXh0LCBldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBfZ2V0UmVjb2duaXplck9iamVjdCgpIHtcclxuXHRcdFx0XHR2YXIgU3BlZWNoUmVjb2duaXplciA9IHdpbmRvdy5TcGVlY2hSZWNvZ25pdGlvbiB8fFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cud2Via2l0U3BlZWNoUmVjb2duaXRpb24gfHxcclxuXHRcdFx0XHRcdFx0XHRcdFx0d2luZG93Lm1velNwZWVjaFJlY29nbml0aW9uIHx8XHJcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5tc1NwZWVjaFJlY29nbml0aW9uIHx8XHJcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vU3BlZWNoUmVjb2duaXRpb247XHJcblxyXG5cdFx0XHRcdGlmIChTcGVlY2hSZWNvZ25pemVyKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gbmV3IFNwZWVjaFJlY29nbml6ZXIoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdF9sb2coJ1NwZWVjaFJlY29nbml0aW9uIG9iamVjdCBub3Qgc3VwcG9ydGVkJyk7XHJcblxyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBfbG9nKCkge1xyXG5cdFx0XHRcdGlmICghIV9vcHRpb25zLmRlYnVnKSB7XHJcblx0XHRcdFx0XHR2YXIgb3V0ID0gd2luZG93LmNvbnNvbGUgfHwgeyBsb2c6IGZ1bmN0aW9uKCkgeyB9IH07XHJcblx0XHRcdFx0XHRvdXQubG9nLmFwcGx5KG91dCwgYXJndW1lbnRzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdF9pbml0KG9wdGlvbnMpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gTXVtYmxlO1xyXG5cdH1cclxuKSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogbm9kZV9tb2R1bGVzL211bWJsZS1qcy9zcmMvbXVtYmxlLmpzXG4gKiovIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUF2QkE7QUE0QkE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQTlCQTtBQUNBOztBQW9DQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUZBO0FBTUE7QUFQQTtBQUxBO0FBNUNBO0FBQ0E7Ozs7O0FBOERBOzs7Ozs7QUNyRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMwQ0E7QUFDQTtBQURBOzs7OztBQVNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FBRkE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBWEE7QUFDQTtBQW9CQTtBQUNBOzs7OztBQTVCQTtBQWtDQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBQ0E7Ozs7QUFsQ0E7QUFrREE7QUFDQTtBQUNBO0FBRkE7QUFEQTtBQUNBOzs7OztBQWxEQTtBQTZEQTtBQURBO0FBQ0E7Ozs7O0FBN0RBO0FBcUVBO0FBREE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBckVBO0FBMEZBO0FBQ0E7QUFEQTtBQUNBOztBQUZBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBZkE7QUFDQTs7Ozs7QUExRkE7QUFnSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBTkE7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUZBO0FBWkE7QUFDQTs7Ozs7OztBQWhIQTtBQXdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFOQTtBQUNBO0FBUUE7QUFaQTtBQUNBOzs7OztBQXhJQTtBQTJKQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBSEE7QUFDQTs7Ozs7OztBQTNKQTtBQXlLQTtBQURBO0FBQ0E7Ozs7Ozs7OztBQXpLQTtBQXFMQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBSEE7QUFDQTs7Ozs7Ozs7OztBQXJMQTtBQXNNQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBSEE7QUFDQTs7Ozs7QUF0TUE7QUFrTkE7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7O0FBSkE7QUFTQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBREE7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFyQkE7QUF3QkE7QUFEQTtBQUNBOztBQXhCQTtBQTZCQTtBQUNBO0FBQ0E7QUEvQkE7QUFDQTtBQWlDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUpBO0FBT0E7QUFEQTtBQUdBO0FBSEE7QUFOQTtBQUpBO0FBQ0E7QUFpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFKQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBTkE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUxBO0FBUUE7QUFDQTs7QUFGQTtBQUtBO0FBQ0E7QUFDQTtBQUNBOztBQUpBO0FBT0E7QUFDQTtBQUNBO0FBVEE7QUFDQTtBQVdBO0FBaEJBO0FBQ0E7O0FBUkE7QUE0QkE7QUFEQTtBQTNCQTtBQUNBO0FBK0JBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUE1Q0E7QUFDQTtBQThDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQWJBO0FBQ0E7QUFlQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBREE7QUFDQTtBQU1BO0FBbldBO0FBQ0E7QUFxV0E7QUFqWEE7OzsiLCJzb3VyY2VSb290IjoiIn0=