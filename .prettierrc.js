/** @type {import("prettier").Config | import("@trivago/prettier-plugin-sort-imports").PluginConfig} */
module.exports = {
  arrowParens: 'always',
  trailingComma: 'none',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  importOrder: [
    // Firstly sort the absolute imports that start with @
    '^@',

    // Then the absolute imports that do not start with @
    '^[^.]',

    // Lastly, sort relative imports
    '^\\.'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports']
};
