import { WebSocketManager } from './WebSocketManager'
import { WebSocketServerWrapper } from './WebSocketServerWrapper'

const wsManager = new WebSocketManager()

export {
  WebSocketServerWrapper,
  WebSocketManager,
  wsManager
}