import * as WebSocket from 'ws'

interface Server {
  id: string;
  wss: WebSocket.Server;
}

class WebSocketManager {
  private wsServers: Server[]

  public constructor() {
    this.wsServers = []
  }

  public createWebSocketServer = (id: string): WebSocket.Server => {
    const wss = new WebSocket.Server({noServer: true})

    this.wsServers.push({id, wss})

    return wss
  }

  public removeWebSocketServer = (id: string): Promise<void> => {
    const index = this.wsServers.findIndex((server): boolean => server.id === id)

    if (index) {
      let server = this.wsServers.splice(index, 1)

      return new Promise((resolve, reject): void => {
        if (!server[0]) {
          reject(new Error('Server was not found in wsServers'))
        }

        server[0].wss.close((err): void => {
          if (err) {
            reject(err)
          }

          resolve()
        })
      })
    }
  }

  public getServers = (): Server[] => {
    return this.wsServers
  }

  public getServer = (id: string): Server => {
    return this.wsServers.find((server): boolean => server.id === id)
  }
}

export {
  WebSocketManager,
}