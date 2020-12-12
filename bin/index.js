import { createServer } from '../src/server'

const server = createServer()
server.start()

process.on('SIGINT', server.stop)
