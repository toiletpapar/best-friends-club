import {KeyboardEvent} from 'react'
import {Action, Actions} from '../utils/Codenames/actions'

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
    if (this.isReady()) {
      this.socket.send(JSON.stringify(action))
    } else {
      console.warn('Tried to send message before socket was ready')
    }
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

  public onAction = (action: Actions, fn: (action: Action) => void): void => {
    this.onMessage((message): boolean => message.type === action, fn)
  }

  public onConnection = (fn: () => void): void => {
    this.socket.addEventListener('open', fn)
  }

  public getReadyState = (): number => {
    return this.socket.readyState
  }

  public isReady = (): boolean => {
    return this.getReadyState() === 1
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

const getCookie = (): {[key: string]: string} => {
  return document.cookie.split(';').reduce((acc, kv): {[key: string]: string} => ({...acc, [kv.split('=')[0]]: kv.split('=')[1]}), {})
}

export {
  WebSocketManager,
  wsManager,
  WebSocketWrapper,
  onEnter,
  getCookie
}