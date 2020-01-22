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
    get: () => {
      // .address() will return `null` if the server has not yet emitted the 'listening' event
      const address = instance.address();
      return address ? address.port : null;
    },
  });

  return instance;
}

module.exports = incito;
