'use strict';

const net = require('net');
const tls = require('tls');
const http = require('http');
const https = require('https');
const process = require('process');

/**
 * Emits a warning if process.emitWarning exits, otherise prints similar
 * output to console.warn
 *
 * @param {String} msg
 */
function warn(msg) {

  if (process.emitWarning) {
    process.emitWarning(msg, 'incito');
  } else {
    // eslint-disable-next-line no-console
    console.warn(`incito: warning, ${msg}`);
  }

}


/**
 * Takes a string and returns the module
 *
 * @param {String|Object} type
 * @return {Object} net|tls|http|https module
 */
function normalizeType(type) {

  if (~[net, tls, http, https].indexOf(type)) {
    return type;
  }

  if (typeof type !== 'string') {
    throw new TypeError('"type" argument must be a string');
  }

  const types = {net, tls, http, https};

  if (!(type in types)) {
    const msg = '"type" argument must be one of: net, tls, http, https';
    throw new ReferenceError(msg);
  }

  return types[type];
}

/**
 * Normalizes the argument passed into an object with type, options, and
 * listener properties
 *
 * @param {Function|Object} arg
 * @return {Object} args
 * @return {Object} args.type
 * @return {Object} args.options
 * @return {Function} args.listener
 */
function normalizeArg(arg) {


  if (arg === undefined) {
    return {type: http};
  }

  let type = http;
  let options = {};
  let listener = arg;

  if (typeof arg === 'object' && 'callback' in arg) {

    // Koa uses `.callback` http://koajs.com/#application
    listener = arg.callback();

  } else if (typeof arg === 'object') {

    // assume options object passed in
    if ('type' in arg) {
      type = normalizeType(arg.type);
    }

    if (!arg.options && ~[tls, https].indexOf(type)) {
      const typeString = type === tls ? 'tls' : 'https';
      warn(`creating ${typeString} server without any certficates or keys`);
    }

    if (arg.options) {
      options = arg.options;
    }

  } else if (typeof arg === 'function') {

    // Express application is a listener function by default
    listener = arg;

  }


  return {type, options, listener};

}

/**
 * Returns an instance of net.Server or one of the objects that extend it,
 * optionally creating it if it does not exist.
 *
 * @param {Function|Object} arg - if function, must be the listener function
 * @param {Function} arg.listener - function to invoke on 'request' event
 * @param {String} arg.type - the type of server to create
 * @param {Object} arg.options - options to pass to server on creation
 */
function create(arg) {

  if (arg instanceof net.Server) {
    return arg;
  }

  const args = normalizeArg(arg);

  if (args.type === http) {
    return http.createServer(args.listener);
  }

  return args.type.createServer(args.options, args.listener);
}

module.exports = {create, normalizeArg, normalizeType, warn};
