import express from 'express'
import * as path from 'path'
import bodyParser from 'body-parser'

import { router as CodenamesRouter } from './Codenames/index'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.dev.client.js'

const app = express()
console.log(`Server starting in ${process.env.NODE_ENV} mode`)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../dist')))
} else {
  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  }))

  app.use(webpackHotMiddleware(compiler))
}

app.use(bodyParser.json())

app.use('/codenames', CodenamesRouter)

app.use('*', (req, res): void => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'))
})

app.listen(8080, (): void => {
  console.log('Server listening on port 8080')
})
