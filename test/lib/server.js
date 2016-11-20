'use strict';

const net = require('net');
const tls = require('tls');
const test = require('ava');
const http = require('http');
const https = require('https');
const process = require('process');
const server = require('../../lib/server');

test('normalizeType', t => {

  t.is(server.normalizeType(net), net);
  t.is(server.normalizeType('net'), net);

  t.is(server.normalizeType(tls), tls);
  t.is(server.normalizeType('tls'), tls);

  t.is(server.normalizeType(http), http);
  t.is(server.normalizeType('http'), http);

  t.is(server.normalizeType(https), https);
  t.is(server.normalizeType('https'), https);

  t.throws(function() {
    server.normalizeType({})
  }, TypeError);

  t.throws(function() {
    server.normalizeType('tron')
  }, ReferenceError);

});


test('normalizeArg', t => {

  const noArg = server.normalizeArg();
  t.is(noArg.type, http);
  t.is(Object.keys(noArg).length, 1);

  function mock() {}
  const options = {
    cert: 'my super secret certs',
  };

  const fn  = server.normalizeArg(mock);
  t.is(fn.listener, mock);
  t.is(fn.type, http);
  t.is(Object.keys(fn).length, 2);


  const noType = server.normalizeArg({
    listener: mock,
    options,
  });

  t.is(noType.type, http);
  t.is(noType.listener, mock);
  t.is(noType.options, options);
  t.is(Object.keys(noType).length, 3);

  const noListener = server.normalizeArg({
    type: 'tls',
    options,
  });

  t.is(noListener.type, tls);
  t.is(noListener.listener, undefined);
  t.is(noListener.options, options);
  t.is(Object.keys(noListener).length, 3);

  const noOptions = server.normalizeArg({
    type: 'net',
    listener: mock,
  });

  t.is(noOptions.type, net);
  t.is(noOptions.listener, mock);
  t.is(typeof noOptions.options, 'object');
  t.is(Object.keys(noOptions).length, 3);

});

test.serial.cb('normalizeArg - warning - tls', t => {

  const listener = warning => {
    t.is(warning.name, 'incito');
    t.true(warning.message.includes('tls'));
    process.removeListener('warning', listener);
    t.end();
  };

  process.on('warning', listener);

  function mock() {}
  const args = server.normalizeArg({
    type: 'tls',
    listener: mock,
  });

  t.is(args.type, tls);
  t.is(args.listener, mock);
  t.is(typeof args.options, 'object');
  t.is(Object.keys(args).length, 3);

});

test.serial.cb('normalizeArg - warning - https', t => {

  const listener = warning => {
    t.is(warning.name, 'incito');
    t.true(warning.message.includes('https'));
    process.removeListener('warning', listener);
    t.end();
  };

  process.on('warning', listener);

  function mock() {}
  const args = server.normalizeArg({
    type: 'https',
    listener: mock,
  });

  t.is(args.type, https);
  t.is(args.listener, mock);
  t.is(typeof args.options, 'object');
  t.is(Object.keys(args).length, 3);

});

test('create', t => {

  const noArg = server.create();
  t.true(noArg instanceof http.Server);
  t.is(noArg.listenerCount('request'), 0);

  const instance = http.createServer();
  const serverArg = server.create(instance);
  t.is(serverArg, instance);

  function mock() {}
  const fnArg = server.create(mock);
  t.true(fnArg instanceof http.Server);
  t.is(fnArg.listenerCount('request'), 1);
  t.is(fnArg.listeners('request')[0], mock);

  const noListener = server.create({
    type: tls,
  });

  t.true(noListener instanceof tls.Server);
  t.is(noListener.listenerCount('request'), 0);

  const listener = server.create({
    type: https,
    listener: mock,
  });

  t.true(listener instanceof https.Server);
  t.is(listener.listenerCount('request'), 1);
  t.is(listener.listeners('request')[0], mock);

  const options = server.create({
    type: net,
    options: {
      allowHalfOpen: true,
    },
  });

  t.true(options instanceof net.Server);
  t.is(options.listenerCount('request'), 0);
  t.true(options.allowHalfOpen);

});
