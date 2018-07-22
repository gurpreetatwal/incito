<h1 align="center">incito</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/incito"><img src="https://img.shields.io/npm/v/incito.svg?style=flat-square" alt="NPM Package"></a>
  <a href="https://travis-ci.org/gurpreetatwal/incito"><img src="https://img.shields.io/travis/gurpreetatwal/incito/master.svg?style=flat-square" alt="Build Status"></a>
  <a href="https://codecov.io/gh/gurpreetatwal/incito"><img src="https://img.shields.io/codecov/c/github/gurpreetatwal/incito.svg?style=flat-square" alt="Coverage"></a>
</p>


## Installation

```sh
npm install incito --save
```

```js
const incito = require('incito');
```

## Usage
### simple http server
```js
const server = incito();
const port = server.port;
```

### http server with listener
```js
function handle() {
  // magical request handling code
}

const server = incito(handle);
```

### express http server
```js
const app = express();
const server = incito(app);
```

### koa http server
```js
const app = new Koa();
const server = incito(app.callback());
```

### other types of servers
```js
const server = incito({
  type: 'https',
  listener: app
  options: {
    key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
    cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem'),
  },
});
