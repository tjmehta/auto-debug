'use strict'
var sinon = require('sinon');

var debugSpies = module.exports = {};

debugSpies.create = function (name) {
  var spies = this.spies;
  spies[name] = spies[name] || sinon.spy();
  return spies[name];
};

debugSpies.spies = {};

debugSpies.reset = function () {
  this.spies = {};
};

