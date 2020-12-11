import { config } from './core'
import createWebsocketServer from './socket'

export function createServer() {
  const ws = createWebsocketServer()

  return {
    start() {
      ws.listen(config.port)
      console.info(`Server listening on port ${config.port}.`)
    },
    async stop() {
      return new Promise((resolve, reject) => {
        ws.close((err) => (err ? reject(err) : resolve()))
      })
    }
  }
}
