/**
 * @type {import("prettier").Config}
 * @see https://prettier.io/docs/en/options.html
 */
export default {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true, // default: false
  quoteProps: 'consistent', // default: as-needed
  trailingComma: 'all',
  bracketSpacing: true,
  objectWrap: 'preserve',
  arrowParens: 'always',
  proseWrap: 'preserve',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
};
