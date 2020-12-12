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
  Status
} from './store'

export function onMatchGet({ store }) {
  return (ack) => {
    const state = store.getState()
    console.log('Retrieving the current match')
    return ack?.(null, {
      status: state.status,
      mode: state.gameMode,
      ...state.match
    })
  }
}

export function onMatchStart({ matchRepository, socket, store }) {
  return async (mode, ack) => {
    const state = store.getState()

    if (isPlaying(state)) {
      return ack?.('A match is already in progress')
    }

    try {
      const match =
        mode === GameMode.RANKED
          ? await matchRepository.create(state.match)
          : state.match
      store.dispatch(setMatch(match))
      store.dispatch(setStatus(Status.PLAYING))
      store.dispatch(setGameMode(mode))
      socket.broadcast.emit(Events.MATCH_STARTED, match)
      return ack?.(null, {
        ...match
      })
    } catch (err) {
      return ack?.(err)
    }
  }
}

export function onMatchCancel({ socket, store }) {
  return (ack) => {
    const state = store.getState()

    if (!isPlaying(state) || isOver(state)) {
      return ack?.('No match in progress')
    }

    // Reset state
    store.dispatch(resetMatch())
    store.dispatch(setStatus(Status.FREE))
    store.dispatch(setGameMode(GameMode.QUICKPLAY))
    socket.broadcast.emit(Events.MATCH_CANCELLED)
    console.log('Match cancelled')
    const newState = store.getState()
    return ack?.(null, {
      status: newState.status,
      mode: newState.gameMode,
      ...newState.match
    })
  }
}

export function onGoalScored({ socket, store }) {
  return (teamName, ack) => {
    const state = store.getState()

    if (!isPlaying(state) || isOver(state)) {
      return ack?.('No match in progress')
    }

    store.dispatch(incrementOther(teamName))
    const scorer = state.teams.find((team) => team.name !== teamName)
    console.log(`Goal scored by ${scorer.name}`)
    socket.broadcast.emit(Events.GOAL_SCORED, scorer.name)
    ack?.(null, scorer.name)
  }
}

export function onScoreIncrement({ socket, store }) {
  return (teamName, ack) => {
    const state = store.getState()

    if (!isPlaying(state) || isOver(state)) {
      return ack?.('No match in progress')
    }

    console.log(`Increment ${teamName}'s points manually`)
    store.dispatch(increment(teamName))
    const newState = store.getState()
    socket.broadcast.emit(Events.SCORE_INCREMENTED, newState.match)
    return ack?.(null, newState.match)
  }
}

export function onScoreDecrement({ socket, store }) {
  return (teamName, ack) => {
    const state = store.getState()

    if (!isPlaying(state) || isOver(state)) {
      return ack?.('No match in progress')
    }

    console.log(`Decrement ${teamName}'s points manually`)
    store.dispatch(decrement(teamName))
    const newState = store.getState()
    socket.broadcast.emit(Events.SCORE_DECREMENTED, newState.match)
    return ack?.(null, newState.match)
  }
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

export function stopAttraction() {
  if (interval) {
    clearInterval(interval)
  }
}

export const createController = ({ matchRepository, socket, store }) => {
  return {
    onMatchGet: onMatchGet({ store }),
    onMatchStart: onMatchStart({ matchRepository, socket, store }),
    onMatchCancel: onMatchCancel({ matchRepository, socket, store }),
    onGoalScored: onGoalScored({ matchRepository, socket, store }),
    onScoreIncrement: onScoreIncrement({ socket, store }),
    onScoreDecrement: onScoreDecrement({ socket, store })
  }
}
