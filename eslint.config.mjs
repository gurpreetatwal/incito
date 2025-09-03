import js from '@eslint/js';
import globals from 'globals';
import {defineConfig} from 'eslint/config';

export default defineConfig([
  {
    ignores: ['coverage'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {js},
    extends: ['js/recommended'],
    languageOptions: {globals: globals.node},
    rules: {
      semi: 'error',
      eqeqeq: 'error',
      indent: ['error', 2],
      quotes: ['error', 'single'],
      'no-trailing-spaces': 'error',
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
]);
