'use strict';
var AutoDebug = require('./lib/auto-debug');

module.exports = createAutoDebug;

function createAutoDebug (globalOpts) {
  return new AutoDebug(globalOpts);
}