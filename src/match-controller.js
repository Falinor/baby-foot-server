import { delay } from './core/delay'
import { Events } from './events'
import {
  GameMode,
  increment,
  incrementOther,
  decrement,
  isOver,
  isPlaying,
  resetMatch,
  setGameMode,
  setMatch,
  setPlayers,
  setStatus,
  Status,
  setScene
} from './store'
import { serialize } from './store/serializer'

export function onMatchGet({ store }) {
  return (ack) => {
    const state = store.getState()
    console.log('Retrieving the current match', state)
    return ack?.(null, {
      status: state.status,
      mode: state.gameMode,
      ...state.match
    })
  }
}

export function onMatchStart({
  attractionRepository,
  matchRepository,
  streamingRepository,
  socket,
  store
}) {
  return async (mode, ack) => {
    const state = store.getState()

    if (isPlaying(state)) {
      return ack?.('A match is already in progress')
    }

    try {
      // TODO
      const scenes = await streamingRepository
        .listScenes()
        .then(({ scenes }) => scenes)
      rotateScenes({ scenes, streamingRepository, store })

      if (mode === GameMode.RANKED) {
        await attractionRepository.start()
        await stopFetchAttraction()
      }
      const match =
        mode === GameMode.RANKED
          ? await matchRepository.create(state.match)
          : state.match
      store.dispatch(setMatch(match))
      store.dispatch(setStatus(Status.PLAYING))
      store.dispatch(setGameMode(mode))
      socket.broadcast.emit(Events.MATCH_STARTED, match)
      // Save the state
      await serialize(store.getState())
      return ack?.(null, match)
    } catch (err) {
      console.error(err)
      return ack?.(err)
    }
  }
}

export function onMatchCancel({
  attractionRepository,
  matchRepository,
  socket,
  store
}) {
  return async (ack) => {
    const state = store.getState()
    console.log(state)

    if (!isPlaying(state) || isOver(state)) {
      return ack?.('No match in progress')
    }

    try {
      if (state.gameMode === GameMode.RANKED) {
        await matchRepository.cancel(state.match.id)
        await attractionRepository.cancel()
        console.log('Cancelled match')
      }

      // Reset state
      store.dispatch(resetMatch())
      store.dispatch(setStatus(Status.FREE))
      store.dispatch(setGameMode(GameMode.QUICKPLAY))
      socket.broadcast.emit(Events.MATCH_CANCELLED)
      console.log('Match cancelled')
      const newState = store.getState()
      // Save the state
      await serialize(newState)
      return ack?.(null, {
        status: newState.status,
        mode: newState.gameMode,
        ...newState.match
      })
    } catch (err) {
      console.error(err)
      return ack?.(err)
    }
  }
}

export function onMatchEnd({
  eventRepository,
  matchRepository,
  socket,
  store
}) {
  return async (ack) => {
    const state = store.getState()

    if (!isPlaying(state)) {
      return ack?.('No match in progress')
    }

    if (!isOver(state)) {
      return ack?.('The game is not over yet')
    }

    try {
      if (state.gameMode === GameMode.RANKED) {
        await matchRepository.end(state.match)
        await eventRepository.create({
          // TODO: rename this type to fit other events
          type: 'match:won',
          match: state.match.id
        })
      }

      store.dispatch(resetMatch())
      store.dispatch(setStatus(Status.FREE))
      store.dispatch(setGameMode(GameMode.QUICKPLAY))
      socket.broadcast.emit(Events.MATCH_ENDED)
      console.log('Match ended')
      const newState = store.getState()
      // Save the state
      await serialize(newState)
      return ack?.(null, newState)
    } catch (err) {
      console.error(err)
      return ack?.(err)
    }
  }
}

export function onGoalScored({ eventRepository, socket, store }) {
  return async (teamName, ack) => {
    const state = store.getState()

    if (!isPlaying(state) || isOver(state)) {
      return ack?.('No match in progress')
    }

    try {
      store.dispatch(incrementOther(teamName))
      const scorer = state.match.teams.find((team) => team.name !== teamName)
      console.log(`Goal scored by ${scorer.name}`)
      socket.broadcast.emit(Events.GOAL_SCORED, scorer.name)

      if (state.gameMode === GameMode.RANKED) {
        await eventRepository.create({
          type: Events.GOAL_SCORED,
          match: state.match.id,
          team: scorer.name
        })
        socket.broadcast.emit(Events.BET_COMPLETED)
      }

      console.log(`Increment ${scorer.name}'s points`)
      // Save the state
      await serialize(store.getState())
      ack?.(null, scorer.name)
    } catch (err) {
      console.log(err)
      ack?.(err)
    }
  }
}

export function onGoalRemoved({ socket, store }) {
  return async (teamName, ack) => {
    const state = store.getState()

    if (!isPlaying(state)) {
      return ack?.('No match in progress')
    }

    store.dispatch(decrement(teamName))
    socket.broadcast.emit(Events.GOAL_SCORED, teamName)
    console.log(`Decrement ${teamName}'s points`)
    // Save the state
    await serialize(store.getState())
    return ack?.(null, teamName)
  }
}

export async function rotateScenes({ scenes, streamingRepository, store }) {
  const state = store.getState()
  console.log(state)
  const doSwitch = async (i) => {
    if (state.streaming.rotate) {
      const scene = scenes[i]
      console.log(`Switch scene to ${scene.name}`)
      await streamingRepository.switchScene(scene.name)
      store.dispatch(setScene(scene.name))
      await delay(state.streaming.timeout)
      await doSwitch((i + 1) % scenes.length)
    }
  }
  await doSwitch(0)
}

let interval

export function fetchAttraction({ attractionRepository, store, server }) {
  interval = setInterval(async () => {
    const state = store.getState()
    if (!isPlaying(state)) {
      const { players } = await attractionRepository.get()
      store.dispatch(setPlayers(players))
      const newState = store.getState()
      server.emit(Events.TEAMS_UPDATE, newState.match.teams)
    }
  }, 3000)
}

export function stopFetchAttraction() {
  if (interval) {
    clearInterval(interval)
  }
}

export const createMatchController = ({
  attractionRepository,
  eventRepository,
  matchRepository,
  streamingRepository,
  socket,
  store
}) => ({
  onMatchGet: onMatchGet({ store }),
  onMatchStart: onMatchStart({
    attractionRepository,
    matchRepository,
    streamingRepository,
    socket,
    store
  }),
  onMatchCancel: onMatchCancel({
    attractionRepository,
    matchRepository,
    socket,
    store
  }),
  onMatchEnd: onMatchEnd({
    eventRepository,
    matchRepository,
    socket,
    store
  }),
  onGoalScored: onGoalScored({ eventRepository, socket, store }),
  onGoalRemoved: onGoalRemoved({ eventRepository, socket, store })
})
