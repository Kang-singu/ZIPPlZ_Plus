module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'prefer-arrow-callback': 'error',
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'consistent-return': 'error',
    'no-var': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
