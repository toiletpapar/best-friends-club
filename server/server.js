const express = require('express')
const path = require('path')

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../dist')))
} else {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')

  const webpackConfig = require('../webpack.dev.js')
  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  }))
}

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'))
})

app.listen(8080, () => {
  console.log('Server listening on port 8080')
})
