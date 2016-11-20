'use strict';

const server = require('./lib/server');
const shim = require('./lib/listening-shim');

shim.register(require('net').Server);

function incito(arg) {

  const instance = server.create(arg);

  if (!instance.listening) {
    instance.listen(0);
  }

  Object.defineProperty(instance, 'port', {
    enumerable: true,
    configurable: true,
    get: () => instance.address().port,
  });

  return instance;
}

module.exports = incito;
