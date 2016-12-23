import { create } from './lib/server.mjs';

/**
 * Add an enumerable, configurable getter fn to an object
 *
 * @param {Object} object - what to attach to
 * @param {string} key - what to attach under
 * @param {function} get - what to attach
 */
function defineGetter(object, key, get) {
  Object.defineProperty(object, key, {
    enumerable: true,
    configurable: true,
    get,
  });
}

/**
 * Creates and starts a server instance
 *
 * @param {import('node:net').Server | Function | { callback: () => Function } | {
 *   listener?: Function,
 *   type?: string | import('node:net') | import('node:tls') | import('node:http') | import('node:https'),
 *   options?: object
 * }} [arg] - Server instance, listener function, Koa app, or configuration object
 * @returns {import('node:net').Server & { port: number | null }} Server instance with port property
 */
function incito(arg) {
  const instance = create(arg);

  if (!instance.listening) {
    instance.listen(0);
  }

  defineGetter(instance, 'port', () => {
    // .address() will return `null` if the server has not yet emitted the 'listening' event
    const address = instance.address();
    return address ? address.port : null;
  });
  defineGetter(instance, 'url', () => `http://localhost:${instance.port}`);

  return instance;
}

export default incito;
