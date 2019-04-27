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
]

module.exports = {
  presets,
}
