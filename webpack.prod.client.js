const merge = require('webpack-merge')
const common = require('./webpack.common.web.js')
const webpack = require('webpack')

module.exports = merge.smart(common, {
  mode: 'production',
  target: 'web',
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.HashedModuleIdsPlugin()
  ]
})
