import * as WebSocket from 'ws'
import { Action, CodenameAction } from '../../utils/Codenames/actions'

class WebSocketServerWrapper {
  private server: WebSocket.Server
  private static PING_INTERVAL: number = 10000
  private noop (): void {}
  
  private initHeartbeats = (): void => {
    this.server.on('connection', (ws: WebSocket & { isAlive: boolean }): void => {
      // Add a heartbeat to every new connection
      ws.isAlive = true

      // Refresh the heartbeat when the client responds to our ping
      ws.on('pong', (): void => {
        ws.isAlive = true
      })
    })

    // Ping all clients
    setInterval((): void => {
      this.broadcast((client: WebSocket & { isAlive: boolean }): void => {
        if (client.isAlive === false) {
          client.terminate()
          return
        }
  
        client.isAlive = false
        client.ping(this.noop)
      })
    }, WebSocketServerWrapper.PING_INTERVAL)
  }

  public constructor(server: WebSocket.Server) {
    this.server = server
    this.initHeartbeats()    
  }

  // Generic broadcast
  public broadcast = (fn: (client: WebSocket & { isAlive: boolean }) => void): void => {
    this.server.clients.forEach((client: WebSocket & { isAlive: boolean }): void => {
      if (client.readyState === WebSocket.OPEN) {
        fn(client)
      }
    })
  }

  // Broadcast an action (JSON). Clients will receive the action as a parsable string.
  public broadcastAction = (action: Action): void => {
    this.broadcast((client): void => client.send(JSON.stringify(action)))
  }

  // Generically execute fn when predicate evaluates to true
  public onMessage = (predicate: (action: Action) => boolean, fn: (action: Action) => void): void => {
    this.server.on('connection', (ws): void => {
      ws.on('message', (message: string): void => {
        try {
          const action: Action = JSON.parse(message)

          if (predicate(action)) {
            fn(action)
          }
        } catch (err) {
          console.error(err)
        }
      })
    })
  }

  // Execute fn when the client's message.type is the specified action
  public onAction = (action: CodenameAction, fn: (action: Action) => void): void => {
    this.onMessage((message: Action): boolean => action === message.type, fn)
  }

  public getServer = (): WebSocket.Server => {
    return this.server
  }
}

export {
  WebSocketServerWrapper
}