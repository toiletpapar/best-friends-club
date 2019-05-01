const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [
          path.resolve(__dirname, './utils/')
        ],
        exclude: [
          path.resolve(__dirname, './node_modules')
        ],
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
  ],
}
