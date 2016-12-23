'use strict';

const server = require('./lib/server');
const shim = require('./lib/listening-shim');

shim.register(require('net').Server);

function incito(arg) {

  const instance = server.create(arg);

  if (!instance.listening) {
    instance.listen(0);
  }

  defineGetter(instance, 'port', () => instance.address().port);
  defineGetter(instance, 'url', () => `https://localhost:${instance.port}`);

  return instance;
}

/**
 * Add an enumerable, configurable getter fn to an object
 *
 * @param {Object} object - what to attach to
 * @param {String} key - what to attach under
 * @param {Function} getter - what to attach
 */
function defineGetter(object, key, getter) {
  Object.defineProperty(object, key, {
    enumerable: true,
    configurable: true,
    get: getter,
  });
}

module.exports = incito;
