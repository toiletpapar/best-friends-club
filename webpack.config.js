const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './client/main.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, './client')
        ],
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, './client')
        ],
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  }
}