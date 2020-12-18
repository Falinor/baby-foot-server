import { config } from './core'
import { stopFetchAttraction } from './match-controller'
import createWebsocketServer from './socket'

export function createServer() {
  const ws = createWebsocketServer()

  return {
    async start() {
      ws.listen(config.port)
      console.info(`Server listening on port ${config.port}.`)
    },
    stop() {
      return new Promise((resolve, reject) => {
        console.log('Stopping the attraction')
        stopFetchAttraction()
        ws.close((err) => (err ? reject(err) : resolve()))
      })
    }
  }
}
