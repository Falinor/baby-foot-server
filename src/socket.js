import socketio from 'socket.io';

import { Events } from './events';

function onMatchJoin(socket) {
  return (teamColor, callback) => {
    console.info(`A player wants to join the ${teamColor} team`);

    callback?.()
  }
}

function onGoalScored(socket) {
  return (team) => {
    console.log(`The team ${team} scored a goal!`)
    socket.broadcast.emit(Events.MATCH_UPDATE, team)
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
