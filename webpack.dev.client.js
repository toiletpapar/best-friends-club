const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.web.js')
const webpack = require('webpack')

module.exports = merge.smart(common, {
  mode: 'development',
  target: 'web',
  entry: {
    app: ['react-hot-loader/patch', 'webpack-hot-middleware/client'],
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: [
          path.resolve(__dirname, './client'),
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]?[contenthash]',
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
})
