import socketio from 'socket.io';

import { Events } from './events';
import store from './store';

const MAX_POINTS = 10

function onMatchJoin(socket) {
  return (teamColor, callback) => {
    console.info(`A player wants to join the ${teamColor} team`);

    callback?.()
  }
}

function onGoalScored(socket) {
  return (teamColor) => {
    // Check the match state
    store.commit('increment', teamColor)
    socket.broadcast.emit(Events.MATCH_UPDATE, store.state.match)
  }
}

export default function createWebsocketServer() {
  const io = socketio()

  io.on('connection', (socket) => {
    console.log('A socket has connected')

    socket.on(Events.MATCH_JOIN, onMatchJoin(socket))
    socket.on(Events.GOAL_SCORED, onGoalScored(socket))
  })

  return io
}
