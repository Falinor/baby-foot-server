import { Server } from 'socket.io'

import { createBetController } from './bet-controller'
import { config } from './core'
import { Events } from './events'
import { createMatchController, fetchAttraction } from './match-controller'
import {
  AttractionRepository,
  BetRepository,
  EventRepository,
  MatchRepository,
  PlayerRepository,
  StreamingRepository
} from './repositories'
import { FakeStreamingService } from './repositories/fake-streaming'
import store, { setGameMode, setMatch, setStatus } from './store'
import { deserialize } from './store/serializer'

export default function createWebsocketServer() {
  const io = new Server({
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
  const attractionRepository = new AttractionRepository({
    playerRepository: new PlayerRepository()
  })
  const matchRepository = new MatchRepository()
  const eventRepository = new EventRepository()
  const betRepository = new BetRepository()
  const streamingRepository = config.feature.streaming
    ? new StreamingRepository()
    : new FakeStreamingService()

  streamingRepository.connect()

  io.on('connection', async (socket) => {
    console.log('A socket has connected')

    const matchController = createMatchController({
      attractionRepository,
      eventRepository,
      matchRepository,
      streamingRepository,
      socket,
      store
    })
    socket.on(Events.MATCH_GET, matchController.onMatchGet)
    socket.on(Events.MATCH_START, matchController.onMatchStart)
    socket.on(Events.MATCH_CANCEL, matchController.onMatchCancel)
    socket.on(Events.MATCH_END, matchController.onMatchEnd)
    socket.on(Events.GOAL_SCORED, matchController.onGoalScored)
    socket.on(Events.GOAL_REMOVED, matchController.onGoalRemoved)

    // Bet controller
    const betController = createBetController({ betRepository, store, socket })
    socket.on(Events.BET_ADD, betController.onBet)
    socket.on(Events.BET_ACCEPT, betController.onBetAccept)
  })

  // attractionRepository.cancel().then(() => {
  //   console.log('Cancelled')
  // })
  // Retrieve the match in progress if any

  deserialize()
    .then((state) => {
      console.log('Found a match in progress', state.match)
      store.dispatch(setMatch(state.match))
      store.dispatch(setStatus(state.status))
      store.dispatch(setGameMode(state.gameMode))
    })
    .catch((err) => {
      console.error(err)
      console.log(`State not found. Skipping...`)
    })
  fetchAttraction({ attractionRepository, store, server: io })

  return io
}
