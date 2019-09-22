import express from 'express'
import * as path from 'path'
import bodyParser from 'body-parser'
import * as http from 'http'
import * as url from 'url'

import { router as CodenamesRouter } from './Codenames/index'
import { wsManager } from './WebSocket'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.dev.client.js'

/**
 * Middleware
 */
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

/**
 * Server
 */
const server = http.createServer(app)

server.on('upgrade', (request, socket, head): void => {
  const pathname = url.parse(request.url).pathname
  let upgraded = false

  /**
   * URLs
   * Codenames: ws://localhost:8080/codenames/socket/:codenamesGameID
   */
  wsManager.getServers().forEach((wsServer): void => {
    if (pathname === wsServer.id) {
      upgraded = true
      wsServer.wss.handleUpgrade(request, socket, head, (ws): void => {
        wsServer.wss.emit('connection', ws, request)
      })
    }
  })
  
  if (!upgraded) {
    socket.destroy()
  }
})

server.listen(8080, (): void => {
  console.log('Server listening on port 8080')
})
