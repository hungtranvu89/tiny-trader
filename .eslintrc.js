module.exports = {
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'max-len': [
      'error',
      {
        code: 110,
        ignoreComments: true
      }
    ],
    'indent-legacy': [
      'error',
      2,
      {
        SwitchCase: 1
      }
    ],
    'no-undef': 'error',
    'no-underscore-dangle': 0,
    'no-console': 1,
    'no-unused-vars': ['error', { args: 'none' }], // used mostly for redux standard functional patterns
    'key-spacing': ['error', { mode: 'minimum' }],
    'arrow-body-style': [
      0,
      'as-needed',
      {
        requireReturnForObjectLiteral: true
      }
    ],
    'comma-dangle': ['error', 'never'],
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'padded-blocks': 0
  }
};
