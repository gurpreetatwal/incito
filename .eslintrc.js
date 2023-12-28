module.exports = {
  extends: 'eslint:recommended',
  env: {
    es6: true,
    es2017: true,
    es2020: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    semi: 'error',
    eqeqeq: 'error',
    indent: ['error', 2],
    quotes: ['error', 'single'],
    'no-trailing-spaces': 'error',
    'comma-dangle': ['error', 'always-multiline'],
  },
};
