const presets = [
  [
    '@babel/env',
    {
      targets: {
        chrome: '73',
      },
      useBuiltIns: false,
      modules: false,
    },
  ],
  '@babel/preset-react',
  '@babel/preset-typescript',
]

const plugins = [
  'react-hot-loader/babel',
  [
    '@babel/plugin-proposal-class-properties',
    {
      loose: true,
    },
  ],
]

module.exports = {
  presets,
  plugins,
}
