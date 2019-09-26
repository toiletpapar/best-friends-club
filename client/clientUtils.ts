import {KeyboardEvent} from 'react'

interface SocketID {
  id: string;
  socket: WebSocket;
}

class WebSocketManager {
  private sockets: SocketID[];

  public constructor() {
    this.sockets = []
  }

  public createWebSocket(id: string, url: string): WebSocket {
    const socket = new WebSocket(url)

    this.sockets.push({id, socket})

    return socket
  }

  public closeWebSocket(id: string): void {
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
  onEnter
}