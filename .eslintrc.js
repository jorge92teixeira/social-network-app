module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: ['react'],
  rules: {
    'no-console': 'off',
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'error',
  },
};