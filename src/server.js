import config from './config';
import createWebsocketServer from './socket';

export function createServer() {
  const ws = createWebsocketServer()

  return {
    async start() {
      return new Promise((resolve) => {
        ws.listen(config.port, () => {
          console.info(`Server listening on port ${config.port}.`)
          resolve()
        })
      })
    },
    async stop() {
      return new Promise((resolve, reject) => {
        ws.close(err => err ? reject(err) : resolve())
      })
    }
  }
}
