var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var expect = Code.expect;

var assign = require('101/assign');
var sinon = require('sinon');
var proxyquire = require('proxyquire'); proxyquire.preserveCache();
var debugSpies = require('./fixtures/debug-spies');
var createDebugSpy = debugSpies.create.bind(debugSpies);
var AutoDebug = proxyquire('../lib/auto-debug', {
  debug: createDebugSpy,
  '@noCallThru': true
});

var debug = require('../index')();

describe('auto-debug', function () {

  describe('debug()', function () {
    beforeEach(function (done) {
      AutoDebug.debugMap = {};
      debugSpies.reset();
      done();
    });

    describe('line and function', function () {
      beforeEach(function (done) {
        debug.options({
          line: true,
          func: true
        });
        done();
      });
      it('should log the line and anonymous function name', function (done) {
        (function () {
          debug(); // this line number
        })();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        var spy = spies[name];
        expect(spy.calledOnce).to.be.true();
        expect(spy.firstCall.args).to.deep.equal(['\b:42 anonymous']);
        done();
      });
      it('should log the line and function name', function (done) {
        (function hello () {
          debug(); // this line number
        })();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        var spy = spies[name];
        expect(spy.calledOnce).to.be.true();
        expect(spy.firstCall.args).to.deep.equal(['\b:54 hello']);
        done();
      });
    });

    describe('line no func', function () {
      beforeEach(function (done) {
        debug.options({
          line: true,
          func: false
        });
        done();
      });
      it('should log the line and anonymous function name', function (done) {
        (function () {
          debug(); // this line number
        })();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        var spy = spies[name];
        expect(spy.calledOnce).to.be.true();
        expect(spy.firstCall.args).to.deep.equal(['\b:76']);
        done();
      });
      it('should log the line and function name', function (done) {
        (function hello () {
          debug(); // this line number
        })();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        var spy = spies[name];
        expect(spy.calledOnce).to.be.true();
        expect(spy.firstCall.args).to.deep.equal(['\b:88']);
        done();
      });
    });

    describe('func no line', function () {
      beforeEach(function (done) {
        debug.options({
          line: false,
          func: true
        });
        done();
      });
      it('should log the line and anonymous function name', function (done) {
        (function () {
          debug(); // this line number
        })();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        var spy = spies[name];
        expect(spy.calledOnce).to.be.true();
        expect(spy.firstCall.args).to.deep.equal(['anonymous']);
        done();
      });
      it('should log the line and function name', function (done) {
        (function hello () {
          debug(); // this line number
        })();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        var spy = spies[name];
        expect(spy.calledOnce).to.be.true();
        expect(spy.firstCall.args).to.deep.equal(['hello']);
        done();
      });
    });
  });
});