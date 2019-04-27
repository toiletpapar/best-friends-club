const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  entry: {
    app: ['react-hot-loader/patch', 'webpack-hot-middleware/client'],
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
})
