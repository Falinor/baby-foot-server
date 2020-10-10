function initialState() {
  return {
    isPlaying: false,
    match: {
      red: {
        points: 0,
        players: []
      },
      blue: {
        points: 0,
        players: []
      }
    }
  }
}

const state = initialState()

const mutations = {
  increment(state, team) {
    state.match[team].points++
  }
}

const actions = {}

export default {
  commit(event, ...args) {
    return mutations[event].call(this, state, ...args)
  },

  dispatch(event, ...args) {
    return actions[event].call(this, state, ...args)
  }
}
