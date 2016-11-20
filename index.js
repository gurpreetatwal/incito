'use strict';

const net = require('net');
const http = require('http');

const shim = require('./lib/listening-shim');

shim.register(net.Server);

function incito(handler, type) {

  const isServer = handler instanceof net.Server;

  // TODO use the type parameter to allow user to decide the type of server they want
  const server = isServer ? handler : http.createServer(handler);

  if (!server.listening) {
    server.listen(0);
  }

  Object.defineProperty(server, 'port', {
    enumerable: true,
    configurable: true,
    get: () => server.address().port,
  });

  return server;
}

module.exports = incito;
