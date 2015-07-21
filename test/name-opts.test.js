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

  describe('name opts', function () {
    beforeEach(function (done) {
      AutoDebug.debugMap = {};
      // hack: proxyquire is doing something strange..
      require('../lib/auto-debug').debugMap = {};
      debugSpies.reset();
      done();
    });

    describe('ext', function () {
      beforeEach(function (done) {
        debug.options({
          name: {
            delimeter: ':',
            ext: true
          }
        });
        done();
      });
      it('should log the line and anonymous function name', function (done) {
        debug();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        expect(name).to.equal('test:name-opts.test.js');
        done();
      });
    });
    describe('delimiter', function () {
      beforeEach(function (done) {
        debug.options({
          name: {
            delimeter: '/',
            ext: false
          }
        });
        done();
      });
      it('should log the line and anonymous function name', function (done) {
        debug();
        var spies = debugSpies.spies;
        var name = Object.keys(spies)[0];
        expect(name).to.exist();
        expect(name).to.equal('test/name-opts.test');
        done();
      });
    });
  });
});