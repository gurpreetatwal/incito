'use strict';

const net = require('net');
const tls = require('tls');
const http = require('http');
const https = require('https');
const process = require('process');

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

  if (typeof arg === 'object') {

    let type, options;

    if ('type' in arg) {
      type = normalizeType(arg.type);
    } else {
      type = http;
    }

    if (!arg.options && ~[tls, https].indexOf(type)) {
      const typeString = type === tls ? 'tls' : 'https';
      process.emitWarning(`creating ${typeString} server without any certficates or keys`, 'incito');
    }

    options = arg.options || {};

    return {type, options, listener: arg.listener}
  }

  return {listener: arg, type: http};
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

module.exports = {create, normalizeArg, normalizeType};
