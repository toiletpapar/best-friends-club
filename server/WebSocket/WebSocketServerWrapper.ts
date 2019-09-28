import * as WebSocket from 'ws'
import { Action, Actions } from '../../utils/Codenames/actions'

export interface WebSocketModifications {
  isAlive: boolean;
}

type ServerSocket<T> = WebSocket & WebSocketModifications & T

class WebSocketServerWrapper<T> {
  private server: WebSocket.Server
  private static PING_INTERVAL: number = 10000
  private noop (): void {}
  
  private initHeartbeats = (): void => {
    this.onSocketConnection((ws: ServerSocket<T>): void => {
      // Add a heartbeat to every new connection
      ws.isAlive = true

      // Refresh the heartbeat when the client responds to our ping
      ws.on('pong', (): void => {
        ws.isAlive = true
      })
    })

    // Ping all clients
    setInterval((): void => {
      this.broadcast((client: ServerSocket<T>): void => {
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
  public broadcast = (fn: (client: ServerSocket<T>) => void): void => {
    this.server.clients.forEach((client: ServerSocket<T>): void => {
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
  public onMessage = <A>(predicate: (action: any) => action is A, fn: (action: A, socket: ServerSocket<T>) => void): void => {
    this.onSocketConnection((ws): void => {
      ws.on('message', (message): void => {
        try {
          const action: Action = JSON.parse(message.toString())

          if (predicate(action)) {
            fn(action, ws)
          }
        } catch (err) {
          console.error(err)
        }
      })
    })
  }

  // Execute fn when the client's message.type is the specified action
  public onAction = <A>(type: Actions, fn: (action: A, socket: ServerSocket<T>) => void): void => {
    this.onMessage((message): message is A => message && type === message.type, fn)
  }

  // Execute fn when an error in the socket occurs
  public onSocketConnectionError = (fn: (error: Error) => void): void => {
    this.onSocketConnection((ws): void => {
      ws.on('error', fn)
    })
  }

  // Execute fn when a socket connects
  public onSocketConnection = (fn: (socket: ServerSocket<T>, request: Express.Request) => void): void => {
    this.server.on('connection', fn)
  }

  // Execute fn when a socket closes
  public onSocketClose = (fn: (ws: ServerSocket<T>) => (code: number, reason: string) => void): void => {
    this.onSocketConnection((ws): void => {
      ws.on('close', fn(ws))
    })
  }

  public getServer = (): WebSocket.Server => {
    return this.server
  }
}

export {
  WebSocketServerWrapper
}