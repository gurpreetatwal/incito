'use strict';

/**
 * Creates a 'listening' property on all instances of constructor.
 * @see https://github.com/nodejs/node/blob/v5.7.0/lib/net.js#L1384
 */
function apply(constructor) {
  Object.defineProperty(constructor.prototype, 'listening', {
    get: function() {
      return Boolean(this._handle);
    },
    configurable: true,
    enumerable: true,
  });
}

/**
 * Creates the shim if prototype of the object passed does not have the
 * 'listening' property
 *
 * @param {Function} constructor -the constructor to check
 */
function register(constructor) {

  const hasProperty = 'listening' in constructor.prototype;

  if (!hasProperty) {
    apply(constructor);
  }
}

module.exports = {apply, register};
