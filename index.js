const net = require('net');
const http = require('http');
const https = require('https');
const process = require('process');

const VERSION = parseFloat(process.version.substring(1));

if (version < 5.7) {
  isListeningPolyfill();
}

function incito(handler, type) {

  const isServer = handler instanceof net.Server;

  // TODO use the type parameter to allow user to decide the type of server they want
  const server = isServer ? handler : http.createServer(handler);

  if (!server.listening) {
    server.listen(0);
  }

  Object.defineProperty(server, 'port', {
    enumerable: true,
    get: () => server.address().port,
  });

  return server;
}

/**
 * @see https://github.com/nodejs/node/blob/v5.7.0/lib/net.js#L1384
 */
function isListeningPolyfill() {
  Object.defineProperty(net.Server.prototype, 'listening', {
    get: function() {
      return !!this._handle;
    },
    configurable: true,
    enumerable: true
  });
}

module.exports = incito;
