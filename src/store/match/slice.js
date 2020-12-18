import { createSlice } from '@reduxjs/toolkit'
import { chunk } from 'lodash'

const getInitialState = () => ({
  teams: [
    { color: 'black', name: 'Batman', players: [], points: 0 },
    { color: 'purple', name: 'Joker', players: [], points: 0 }
  ],
  createdAt: new Date().toJSON()
})

export const matchSlice = createSlice({
  name: 'match',
  initialState: getInitialState(),
  reducers: {
    resetMatch() {
      return getInitialState()
    },
    setMatch(state, action) {
      return action.payload
    },
    setPlayers(state, action) {
      const players = action.payload
      // const combs = combinations(players, 2, 2).map((players) =>
      //   meanBy(players, 'rank')
      // )
      const playerChunks = chunk(players, Math.ceil(players.length / 2))
      state.teams.forEach((team, i) => {
        team.players = playerChunks[i] ?? []
      })
    },
    increment(state, action) {
      const team = state.teams.find((team) => team.name === action.payload)
      if (team) {
        team.points++
      }
    },
    incrementOther(state, action) {
      const team = state.teams.find((team) => team.name !== action.payload)
      if (team) {
        team.points++
      }
    },
    decrement(state, action) {
      const team = state.teams.find((team) => team.name === action.payload)
      if (team) {
        team.points--
      }
    },
    decrementOther(state, action) {
      const team = state.teams.find((team) => team.name !== action.payload)
      if (team) {
        team.points--
      }
    }
  }
})

export const {
  resetMatch,
  setMatch,
  setPlayers,
  increment,
  incrementOther,
  decrement,
  decrementOther
} = matchSlice.actions
export const matchReducer = matchSlice.reducer
