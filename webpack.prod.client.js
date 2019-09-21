const merge = require('webpack-merge')
const common = require('./webpack.common.web.js')
const webpack = require('webpack')
const path = require('path')

module.exports = merge.smart(common, {
  mode: 'production',
  target: 'web',
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: [
          path.resolve(__dirname, './client'),
        ],
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin()
  ]
})
