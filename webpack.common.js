const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, './client/main.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, './client'),
        ],
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, './client'),
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
}
