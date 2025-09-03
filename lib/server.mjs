import net from 'node:net';
import tls from 'node:tls';
import http from 'node:http';
import https from 'node:https';
import process from 'node:process';

/**
 * Takes a string and returns the module
 *
 * @param {string | import('node:net') | import('node:tls') | import('node:http') | import('node:https')} type - Server type or module
 * @returns {import('node:net') | import('node:tls') | import('node:http') | import('node:https')} The corresponding Node.js server module
 * @throws {TypeError} When type is not a string or valid module
 * @throws {ReferenceError} When string type is not supported
 */
export function normalizeType(type) {
  if ([net, tls, http, https].includes(type)) {
    return type;
  }

  if (typeof type !== 'string') {
    throw new TypeError('"type" argument must be a string');
  }

  const types = { net, tls, http, https };

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
 * @param {Function | {
 *   type?: string | import('node:net') | import('node:tls') | import('node:http') | import('node:https'),
 *   options?: object,
 *   listener?: Function
 * }} [arg] - Server configuration or listener function
 * @returns {{
 *   type: import('node:net') | import('node:tls') | import('node:http') | import('node:https'),
 *   options: object,
 *   listener?: Function
 * }} Normalized server configuration
 */
export function normalizeArg(arg) {
  if (arg === undefined) {
    return { type: http };
  }

  if (typeof arg === 'object') {
    const type = 'type' in arg ? normalizeType(arg.type) : http;

    if (!arg.options && [tls, https].includes(type)) {
      const typeString = type === tls ? 'tls' : 'https';
      process.emitWarning(
        `creating ${typeString} server without any certficates or keys`,
        'incito',
      );
    }

    const options = arg.options ?? {};

    return { type, options, listener: arg.listener };
  }

  return { listener: arg, type: http };
}

/**
 * Returns an instance of net.Server or one of the objects that extend it,
 * optionally creating it if it does not exist.
 *
 * @param {import('node:net').Server | Function | {
 *   listener?: Function,
 *   type?: string | import('node:net') | import('node:tls') | import('node:http') | import('node:https'),
 *   options?: object
 * }} [arg] - Server instance, listener function, or configuration object
 * @returns {import('node:net').Server | import('node:tls').Server | import('node:http').Server | import('node:https').Server} Server instance
 */
export function create(arg) {
  if (arg instanceof net.Server) {
    return arg;
  }

  const args = normalizeArg(arg);

  if (args.type === http) {
    return http.createServer(args.listener);
  }

  return args.type.createServer(args.options, args.listener);
}
