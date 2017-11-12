'use strict';

let axios;

try {
  axios = require('axios');
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    throw new Error('You must install axios if you wish to use incito/axios');
  }
  throw e;
}

const http = require('http');
const incito = require('..');

function incitoAxios(...args) {
  const server = incito(...args);

  const protocol = server instanceof http.Server ? 'http' : 'https';
  const request = axios.create({
    baseURL: `${protocol}://${server.address().address}:${server.port}`,
  });

  request.server = server;
  return request;
}
module.exports = incitoAxios;
