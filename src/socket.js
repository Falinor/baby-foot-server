import { Server } from 'socket.io'

import { createController, fetchAttraction } from './controller'
import { Events } from './events'
import {
  AttractionRepository,
  MatchRepository,
  PlayerRepository
} from './repositories'
import store from './store'

export default function createWebsocketServer() {
  const io = new Server({
    cors: {
      origin: true,
      methods: ['GET', 'POST']
    }
  })
  const attractionRepository = new AttractionRepository({
    playerRepository: new PlayerRepository()
  })
  const matchRepository = new MatchRepository()

  io.on('connection', (socket) => {
    console.log('A socket has connected')

    const controller = createController({ matchRepository, socket, store })
    socket.on(Events.MATCH_GET, controller.onMatchGet)
    socket.on(Events.MATCH_START, controller.onMatchStart)
    socket.on(Events.MATCH_CANCEL, controller.onMatchCancel)
    socket.on(Events.GOAL_SCORED, controller.onGoalScored)
    socket.on(Events.SCORE_INCREMENT, controller.onScoreIncrement)
    socket.on(Events.SCORE_DECREMENT, controller.onScoreDecrement)
  })

  fetchAttraction({ attractionRepository, store, server: io })

  return io
}
