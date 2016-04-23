import SpeechAdapter from 'adapters/speech_adapter';
import { expect, assert } from 'chai';
import sinon from 'sinon';
import $, { Deferred } from 'jquery-deferred';


function test() {
    const Promise = (new Deferred()).promise().constructor;

    describe('Speech Adapter module', () => {

        let setCommands;
        let start;
        let speechAdapter;

        beforeEach(() => {
            setCommands = sinon.spy();
            start = sinon.spy();

            speechAdapter = new SpeechAdapter({
                setCommands,
                start
            });
        });

        afterEach(() => {
            setCommands = null;
            start = null;
            speechAdapter = null;
        });

        describe('setCommands method should set currect commands array', () => {
            it('should save correct commands to self', () => {
                const valueToTest = {
                    greeting: {},
                    mainCommands: {}
                };

                speechAdapter.setCommands(valueToTest);

                expect(speechAdapter.commands).equals(valueToTest);
            });

            it('should return self', () => {
                expect(speechAdapter.setCommands({ greeting: {}, mainCommands: {} })).equals(speechAdapter);
            });

            it('should check commands and throw exception if any command has incorrect format', () => {
                const valueToTest = {
                    greeting: {}
                };

                assert.throws(speechAdapter.setCommands.bind(this, valueToTest), 'Incorrect commands format exception');
            });

        });

        describe('start method should start recognition proccess', () => {
            it('should throw exception if commands is empty', () => {
                assert.throws(speechAdapter.start.bind(speechAdapter), 'Empty commands exception');
            });

            it('should call recognizer start method if commands is not empty', () => {
                const valueToTest = {
                    greeting: {},
                    mainCommands: {}
                };

                speechAdapter.setCommands(valueToTest);
                speechAdapter.start();

                expect(start.calledWith()).equals(true);
            });

        });

        describe('waitGreeeting method should call setCommands with initial commands', () => {
            it('should call recognizer setCommands with greeting params', () => {
                const greet = { 'hello': 'hi' };
                const main = { 'other': 'oth' };

                const valueToTest = {
                    greeting: greet,
                    mainCommands: main
                };

                speechAdapter.setCommands(valueToTest);
                speechAdapter.waitGreeeting();

                expect(setCommands.calledWith(greet)).equals(true);
            });
        });

        describe('startMainCommands method should call setCommands with all commands', () => {
            it('should call recognizer start method', () => {
                const greet = { 'hello': 'hi' };
                const main = { 'other': 'oth' };

                const valueToTest = {
                    greeting: greet,
                    mainCommands: main
                };

                speechAdapter.setCommands(valueToTest);
                speechAdapter.startMainCommands();

                expect(setCommands.calledWith(main)).equals(true);
            });
        });

    });
}

export default {
    test
};