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
  var ctx;
  describe('debug.trace()', function () {
    beforeEach(function (done) {
      ctx = {};
      ctx.DEBUG_TRACE = process.env.DEBUG_TRACE;
      process.env.DEBUG_TRACE = true;
      AutoDebug.debugMap = {};
      // hack: proxyquire is doing something strange..
      require('../lib/auto-debug').debugMap = {};
      debugSpies.reset();
      done();
    });

    describe('func, line, args, caller', function () {
      beforeEach(function (done) {
        debug.options({
          func: true,
          line: true,
          args: true,
          caller: true
        });
        done();
      });
      afterEach(function (done) {
        process.env.DEBUG_TRACE = ctx.DEBUG_TRACE;
        done();
      });

      it('should log func, line, args, caller', function (done) {
        (function yolo () {
          debug.trace(); // this line number
        })();
        (function () {
          debug.trace(); // this line number
        })();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        var spy = spies[name];
        expect(spy.calledTwice).to.be.true();
        expect(spy.firstCall.args).to.deep.equal(['%s %s %o %s', 'yolo', 54, {}, 'from test/trace.test.js:55']);
        expect(spy.secondCall.args).to.deep.equal(['%s %s %o %s', 'anonymous', 57, {}, 'from test/trace.test.js:58']);
        done();
      });
    });
    describe('line, args, caller', function () {
      beforeEach(function (done) {
        ctx = {};
        ctx.DEBUG_TRACE = process.env.DEBUG_TRACE;
        process.env.DEBUG_TRACE = true;
        debug.options({
          func: false,
          line: true,
          args: true,
          caller: true
        });
        done();
      });
      afterEach(function (done) {
        process.env.DEBUG_TRACE = ctx.DEBUG_TRACE;
        done();
      });

      it('should log line, args, caller', function (done) {
        (function () {
          debug.trace(); // this line number
        })();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        var spy = spies[name];
        expect(spy.calledOnce).to.be.true();
        expect(spy.firstCall.args).to.deep.equal(['%s %o %s', 89, {}, 'from test/trace.test.js:90']);
        done();
      });
    });
    describe('args, caller', function () {
      beforeEach(function (done) {
        debug.options({
          func: false,
          line: false,
          args: true,
          caller: true
        });
        done();
      });
      afterEach(function (done) {
        process.env.DEBUG_TRACE = ctx.DEBUG_TRACE;
        done();
      });

      it('should log args, caller', function (done) {
        (function (a, b, c) {
          debug.trace(); // this line number
        })(10, 20, 30);
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        var spy = spies[name];
        expect(spy.calledOnce).to.be.true();
        expect(spy.firstCall.args).to.deep.equal(['%o %s', { a:10, b:20, c:30 }, 'from test/trace.test.js:118']);
        done();
      });
    });
    describe('caller', function () {
      beforeEach(function (done) {
        debug.options({
          func: false,
          line: false,
          args: false,
          caller: true
        });
        done();
      });
      afterEach(function (done) {
        process.env.DEBUG_TRACE = ctx.DEBUG_TRACE;
        done();
      });

      it('should log caller', function what (done) {
        (function () {
          debug.trace(); // this line number
        })();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        var spy = spies[name];
        expect(spy.calledOnce).to.be.true();
        expect(spy.firstCall.args).to.deep.equal(['%s', 'from what test/trace.test.js:146']);
        done();
      });
    });
    describe('nothing', function () {
      beforeEach(function (done) {
        debug.options({
          func: false,
          line: false,
          args: false,
          caller: false
        });
        done();
      });
      afterEach(function (done) {
        process.env.DEBUG_TRACE = ctx.DEBUG_TRACE;
        done();
      });

      it('should log caller', function what (done) {
        (function () {
          debug.trace(); // this line number
        })();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        var spy = spies[name];
        expect(spy.calledOnce).to.be.true();
        expect(spy.firstCall.args).to.deep.equal(['']);
        done();
      });
    });
    describe('DEBUG_TRACE = false', function () {
      beforeEach(function (done) {
        delete process.env.DEBUG_TRACE;
        debug.options({
          func: false,
          line: false,
          args: false,
          caller: true
        });
        done();
      });
      afterEach(function (done) {
        process.env.DEBUG_TRACE = ctx.DEBUG_TRACE;
        done();
      });

      it('should not call debug', function what (done) {
        (function () {
          debug.trace(); // this line number
        })();
        var spies = debugSpies.spies;
        expect(Object.keys(spies).length).to.equal(0);
        done();
      });
    });
  });
});