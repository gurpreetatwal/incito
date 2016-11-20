'use strict';

const test = require('ava');
const shim = require('../../lib/listening-shim');

test('shim', t => {

  function Mock() {
    this._handle = 'test';
  }

  shim.apply(Mock);

  const mock = new Mock();
  const proto = Object.getPrototypeOf(mock);
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'listening');

  t.true('listening' in mock);

  t.true(proto.hasOwnProperty('listening'));
  t.true(proto.propertyIsEnumerable('listening'));

  t.true(descriptor.enumerable);
  t.true(descriptor.configurable);
  t.truthy(descriptor.get);

  t.falsy(descriptor.writable);
  t.falsy(descriptor.set);
  t.falsy(descriptor.value);

  t.true(mock.listening);

  mock._handle = 0;
  t.false(mock.listening);
});

test('register - true', t => {

  function Mock() {}
  shim.register(Mock);

  const mock = new Mock();
  const proto = Object.getPrototypeOf(mock);
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'listening');

  t.true('listening' in mock);

  t.true(proto.hasOwnProperty('listening'));
  t.true(proto.propertyIsEnumerable('listening'));

  t.true(descriptor.enumerable);
  t.true(descriptor.configurable);
  t.truthy(descriptor.get);

  t.falsy(descriptor.writable);
  t.falsy(descriptor.set);
  t.falsy(descriptor.value);

});

test('register - false', t => {

  function Mock() {}
  Mock.prototype.listening = 'set';

  shim.register(Mock);

  const mock = new Mock();
  const proto = Object.getPrototypeOf(mock);
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'listening');

  t.true('listening' in mock);
  t.true(proto.hasOwnProperty('listening'));

  t.falsy(descriptor.get);

  t.is(descriptor.value, 'set');

});
