'use strict';

const server = require('./lib/server');

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
