module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ['plugin:prettier/recommended'],
  globals: {},
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018
  },
  plugins: ['prettier'],
  rules: {
    'no-useless-return': 0,
    'no-unused-vars': 1,
    'no-console': 'off'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};
