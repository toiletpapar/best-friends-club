const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const nodeExternals = require('webpack-node-externals')

module.exports = merge.smart(common, {
  entry: {
    server: [path.resolve(__dirname, './server/server.ts')],
  },
  context: path.resolve(__dirname),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/',
  },
  target: 'node',
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [
          path.resolve(__dirname, './server'),
        ],
        use: {
          loader: 'babel-loader',
        },
      }
    ],
  },
  externals: [nodeExternals()],
  node: {
    __dirname: true,
    __filename: true,
  }
})
