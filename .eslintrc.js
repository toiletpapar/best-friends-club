module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
    'jest': true
  },
  'extends': ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended'],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    'react-hooks',
    '@typescript-eslint'
  ],
  'rules': {
    'semi': ['error', 'never'],
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  'settings': {
    'react': {
      'version': 'detect'
    }
  }
};
