import { Events } from './events'
import { isOver, isPlaying } from './store'

export function onBet({ betRepository, socket, store }) {
  return async (bet, ack) => {
    const state = store.getState()

    if (!isPlaying(state) || isOver(state)) {
      return ack?.('No match in progress')
    }

    try {
      const created = await betRepository.create({
        ...bet,
        match: state.match.id
      })
      socket.broadcast.emit(Events.BET_ADDED, created)
      return ack?.(null, created)
    } catch (err) {
      console.error(err)
      return ack?.(err)
    }
  }
}

export function onBetAccept({ betRepository, socket, store }) {
  return async (acceptObj, ack) => {
    const state = store.getState()

    if (!isPlaying(state) || isOver(state)) {
      return ack?.('No match in progress')
    }

    try {
      const bet = await betRepository.accept(acceptObj)
      socket.broadcast.emit(Events.BET_ACCEPTED, bet)
      return ack?.(null, bet)
    } catch (err) {
      console.error(err)
      return ack?.(err)
    }
  }
}

export const createBetController = ({ betRepository, socket, store }) => ({
  onBet: onBet({ betRepository, socket, store }),
  onBetAccept: onBetAccept({ betRepository, socket, store })
})
