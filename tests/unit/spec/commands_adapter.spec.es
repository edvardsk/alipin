import CommandsAdapter from 'adapters/commands_adapter';
import { expect, assert } from 'chai';
import sinon from 'sinon';
import $, { Deferred } from 'jquery-deferred';


function test() {
    const Promise = (new Deferred()).promise().constructor;

    let adapter;

    describe('\nCommands Adapter module', function () {
        beforeEach(() => {
            adapter = new CommandsAdapter(null, null, null, {
                stopPlayAudio: () => {}
            }, null);

            adapter.messageTimeout = 10;
        });

        describe('init method should init commands', () => {

            it ('created commands adapter object should has no commands', () => {
                expect(adapter.commands).equals(null);
            });

            it ('after init method commands adapter object should has commands', () => {
                adapter.init();
                expect(adapter.commands).to.not.equal(null);
            });

            it ('commnads adapter object after initialization should has two required commands groups', () => {
                adapter.init();

                expect(adapter.commands.greeting).to.not.equal(null);
                expect(adapter.commands.mainCommands).to.not.equal(null);
            });
        });

        describe('blockActions method should lock any action until timeout', function () {

            it ('blockActions method should set isActionBlocked to true', () => {
                adapter.init();
                adapter.blockActions();
                expect(adapter.isActionBlocked).equals(true);
            });

            it ('blockActions method should call unBlockActions after const timeout', (done) => {
                adapter.unBlockActions = sinon.spy();
                adapter.init();
                adapter.blockActions();
                setTimeout(() => {
                    expect(adapter.unBlockActions.calledWith()).equals(false);
                    done();
                }, 50);
            });

            it ('blockActions method should prevent all action until timeout', () => {
                adapter.greeting = sinon.spy();
                adapter.init();
                adapter.blockActions();
                adapter.commands.greeting[':lривет :name'].callback();

                expect(adapter.greeting.calledWith()).equals(false);
            });
        });

        describe('unBlockActions method should unlock any action and reset timeout', () => {

            it ('unBlockActions method should set isActionBlocked to false', () => {
                adapter.init();
                adapter.blockActions();
                adapter.unBlockActions()
                expect(adapter.isActionBlocked).equals(false);
            });

            it ('after unblocking action should be possible to call any command', () => {
                adapter.greeting = sinon.spy();

                adapter.init();
                adapter.blockActions();
                adapter.unBlockActions();
                adapter.commands.greeting[':lривет :name'].callback();

                expect(adapter.greeting.calledWith()).equals(true);
            });
        });

    });
}

export default {
    test
};