'use strict';

const net = require('net');
const test = require('ava');
const incito = require('../');

test('incito', t => {

  let instance = incito();
  t.true(instance instanceof net.Server);
  t.truthy(instance.port);
  t.true(instance.listening);

  let server = net.createServer();
  server.listen(34532);

  instance = incito(server);
  t.true(instance instanceof net.Server);
  t.is(instance.port, 34532);
  t.true(instance.listening);

  const descriptor = Object.getOwnPropertyDescriptor(instance, 'port');
  t.true(descriptor.enumerable);
  t.true(descriptor.configurable);
  t.truthy(descriptor.get);
  t.falsy(descriptor.writable);
  t.falsy(descriptor.value);
  t.falsy(descriptor.set);
});
