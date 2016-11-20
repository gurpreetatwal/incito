const net = require('net');
const test = require('ava');
const incito = require('../');

test('basic', t => {
  const server = incito();

  t.true(server instanceof net.Server);
  t.truthy(server.port);
  t.true(server.listening);
});
