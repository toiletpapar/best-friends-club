import {KeyboardEvent} from 'react'
import {Action, CodenameAction} from '../utils/Codenames/actions'

interface SocketID {
  id: string;
  socket: WebSocket;
}

class WebSocketWrapper {
  private socket: WebSocket

  public constructor(socket: WebSocket) {
    this.socket = socket
  }

  public send = (action: Action): void => {
    this.socket.send(JSON.stringify(action))
  }

  public onMessage = (predicate: (action: Action) => boolean, fn: (action: Action) => void): void => {
    this.socket.addEventListener('message', (event): void => {
      try {
        const action: Action = JSON.parse(event.data)

        if (predicate(action)) {
          fn(action)
        }
      } catch (err) {
        console.error(err)
      }
    })
  }

  public onAction = (action: CodenameAction, fn: (action: Action) => void): void => {
    this.onMessage((message): boolean => message.type === action, fn)
  }
}

class WebSocketManager {
  private sockets: SocketID[];

  public constructor() {
    this.sockets = []
  }

  public createWebSocket = (id: string, url: string): WebSocket => {
    const socket = new WebSocket(url)

    this.sockets.push({id, socket})

    return socket
  }

  public closeWebSocket = (id: string): void => {
    const index = this.sockets.findIndex((socket): boolean => socket.id === id)

    if (index !== -1) {
      const socket = this.sockets.splice(index, 1)
      socket[0].socket.close()
    }
  }
}

const wsManager = new WebSocketManager()

// Return a function that executes when keycode is 13. Useful for keydown/keyup events.
const onEnter = (fn: Function): <T>(event: KeyboardEvent<T>) => void => {
  return <T>(event: KeyboardEvent<T>): void => {
    if (event.key === 'Enter') {
      fn()
    }
  }
}

export {
  WebSocketManager,
  wsManager,
  WebSocketWrapper,
  onEnter
}