module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  plugins: ['@typescript-eslint', 'unused-imports', 'eslint-comments'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['.eslintrc.js', 'dist/**/*'],
  rules: {
    // Default rules
    'arrow-parens': 'warn',
    'prefer-const': 'warn',
    eqeqeq: 'warn',
    'no-var': 'error',

    // Typescript rules
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/semi': 'warn',
    '@typescript-eslint/quotes': ['warn', 'single'],
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-empty-function': 'error',

    // Third-party plugin rules
    'eslint-comments/no-unused-disable': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ],
    'unused-imports/no-unused-imports': 'error'
  }
};
