import { createSlice } from '@reduxjs/toolkit'

const getInitialState = () => ({
  teams: [
    { color: 'black', name: 'Batman', players: [], points: 0 },
    { color: 'purple', name: 'Joker', players: [], points: 0 }
  ]
})

export const matchSlice = createSlice({
  name: 'match',
  initialState: getInitialState(),
  reducers: {
    resetMatch() {
      return getInitialState()
    },
    setMatch(state, action) {
      state = action.payload
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
  setMatch,
  increment,
  incrementOther,
  decrement,
  decrementOther,
  resetMatch
} = matchSlice.actions
export const matchReducer = matchSlice.reducer
