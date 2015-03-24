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
  var ctx = {};
  describe('options', function () {
    beforeEach(function (done) {
      AutoDebug.debugMap = {};
      // hack: proxyquire is doing something strange..
      require('../lib/auto-debug').debugMap = {};
      debugSpies.reset();
      done();
    });

    describe('local', function () {
      it('should throw an error for non-object', function (done) {
        expect(debug.options.bind(debug, 'bogus')).to.throw(Error, /object/);
        done();
      });
      it('get undefined opts', function (done) {
        var x = debug.options();
        done();
      });
    });
    describe('global', function () {
      it('should log the line and anonymous function name', function (done) {
        var createDebug = require('../index');
        expect(createDebug.bind(null, 'bogus')).to.throw(Error, /object/);
        done();
      });
    });
  });
});