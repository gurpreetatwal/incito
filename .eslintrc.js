module.exports = {
  extends: 'eslint:recommended',
  env: {
    es6: true,
    node: true,
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
