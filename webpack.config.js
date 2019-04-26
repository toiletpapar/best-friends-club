const path = require('path')

module.exports = {
  mode: 'development',
  entry: './client/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}