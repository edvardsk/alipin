var conf = require('../src/util/conf.js'),
    expect = require("chai").expect;

describe('Conf', function() {
    describe('object', function () {
        it('should exists', function () {
            expect(conf).to.exist;
        });

        it('should has correct API', function () {
            expect(conf).to.have.deep.property('get');
            expect(conf).to.have.deep.property('set');
        });
    });

    describe('get', function () {
        it('should return correct logLevel value', function () {
            expect(conf.get('LogLevel')).to.equal(0);
        });

        it('should return null for incorrect property', function () {
            expect(conf.get('LogLevelaasdas')).to.be.null;
        });
    });

    describe('set', function () {
        it('should add new property', function () {
            conf.set('a', 'aaa');
            expect(conf.get('a')).to.equal('aaa');
        });

        it('should set new value to existing property', function () {
            conf.set('LogLevel', 4);
            expect(conf.get('LogLevel')).to.equal(4);
        });
    });
});