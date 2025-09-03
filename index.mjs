import { create } from './lib/server.mjs';

/**
 * Creates and starts a server instance
 *
 * @param {import('node:net').Server | Function | {
 *   listener?: Function,
 *   type?: string | import('node:net') | import('node:tls') | import('node:http') | import('node:https'),
 *   options?: object
 * }} [arg] - Server instance, listener function, or configuration object
 * @returns {import('node:net').Server & { port: number | null }} Server instance with port property
 */
function incito(arg) {
  const instance = create(arg);

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

export default incito;
