'use strict';
var path = require('path');
var debugModule = require('debug');
var getStack = require('callsite');
var isObject = require('101/is-object');
var isFunction = require('101/is-function');
var isString = require('101/is-string');
var defaults = require('101/defaults');
var assign = require('101/assign');
var exists = require('101/exists');
var defaultOpts = {
  name: {
    delimeter: '/',
    ext: true
  },
  line: true,
  func: true,
  args: true,
  caller: true,
  stack : false
};

function AutoDebug (globalOpts) {
  if (exists(globalOpts) && !isObject(globalOpts)) {
    throw new Error('global options must be an object');
  }
  AutoDebug.globalOpts = [
    {},
    globalOpts,
    AutoDebug.globalOpts,
    defaultOpts
  ].reduce(defaults);
  var log = this.log.bind(this);
  assign(log, {
    trace:   this.trace.bind(this),
    options: this.options.bind(this)
  });
  return log;
}

AutoDebug.globalOpts = {};
AutoDebug.debugMap = {};

AutoDebug.prototype.log = function () {
  var callee = getStack()[1];
  var filepath = callee.getFileName();
  var debug = this.getDebugForFilepath(filepath);
  var args = Array.prototype.slice.call(arguments);
  this.enhanceLogArgs(args, callee);
  debug.apply(debug, args);
};

AutoDebug.prototype.trace = function () {
  if (!process.env.DEBUG_TRACE) { return; }
  var opts = this.options();
  var stack = getStack();
  var callee = stack[1];
  var caller = stack[2];
  var args = [];
  var str = '';
  if (opts.line) {
    str += '\b:%s';
    args.push(callee.getLineNumber());
  }
  if (opts.func) {
    str += ' %s';
    args.push(callee.getFunctionName() || 'anonymous');
  }
  if (opts.args) {
    str += ' %o';
    args.push(this.calleeArgsAsObj(callee));
  }
  if (opts.caller) {
    str += ' %s';
    args.push(this.formatCaller(caller));
  }
  str = str.trim();
  var filepath = callee.getFileName();
  var debug = this.getDebugForFilepath(filepath);
  args.unshift(str);
  debug.apply(debug, args);
};

AutoDebug.prototype.options = function (localOpts) {
  var self = this;
  function setter () {
    if (!isObject(localOpts)) {
      throw new Error('local options must be an object');
    }
    self.opts = localOpts;
    return self.opts;
  }
  function getter () {
    var opts = {};
    [
      opts,
      self.opts || {},
      AutoDebug.globalOpts,
      defaultOpts
    ].reduce(defaults);
    // console.trace('getter', opts, self.opts);
    return opts;
  }
  if (exists(localOpts)) {
    return setter(localOpts);
  }
  else {
    return getter();
  }
};

AutoDebug.prototype.getDebugForFilepath = function (filepath) {
  // check if debug already exists for filepath
  var debugMap = AutoDebug.debugMap;
  var debug = debugMap[filepath];
  if (!debug) {
    // debug was used in filepath for first time, create debug
    var name = this.filepathToName(filepath);
    debug = debugMap[filepath] = debugModule(name);
  }
  return debug;
};

AutoDebug.prototype.enhanceLogArgs = function (args, callee) {
  var opts = this.options();
  var arg;
  if (opts.func) {
    arg = callee.getFunctionName() || 'anonymous';
    this.prependArgs(args, arg);
  }
  if (opts.line) {
    arg = callee.getLineNumber();
    this.prependArgs(args, '\b:'+arg);
  }
  return args;
};

AutoDebug.prototype.prependArgs = function (args, arg) {
  if (args.length && isString(args[0])) {
    args[0] = arg + ' ' + args[0];
  }
  else {
    args.unshift(arg.toString());
  }
};

var backslash = /\//g;
AutoDebug.prototype.filepathToName = function (filepath) {
  var relPath = path.relative(process.cwd(), filepath);
  var ext = path.extname(relPath);
  var nameOpts = this.options().name;
  var name = relPath
    .replace(backslash, nameOpts.delimeter);
  if (!nameOpts.ext) {
    name = name
      .slice(0, 0-ext.length);
  }
  return name;
};

AutoDebug.prototype.calleeArgsAsObj = function (callee) {
  var fn = callee.getFunction();
  var args = Array.prototype.slice.call(fn.arguments);
  var paramNames = getParamNames(fn) || [];
  return paramNames.reduce(function (argsObj, name, i) {
    argsObj[name] = args[i];
    return argsObj;
  }, {});
};

AutoDebug.prototype.formatCaller = function (caller) {
  var functionName = caller.getFunctionName() ?
    ' ' + caller.getFunctionName() :
    '';
  var relPath = path.relative(process.cwd(), caller.getFileName());
  var callerStr = [
    'from' + functionName,
    relPath+':'+caller.getLineNumber()
  ].join(' ');
  return callerStr;
};

module.exports = AutoDebug;


function getParamNames(fn) {
  var funStr = fn.toString();
  return funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
}