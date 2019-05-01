const merge = require('webpack-merge')
const common = require('./webpack.common.server.js')
const webpack = require('webpack')

module.exports = merge.smart(common, {
  mode: 'development',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
})
