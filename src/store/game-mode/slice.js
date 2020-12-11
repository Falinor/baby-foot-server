import { createSlice } from '@reduxjs/toolkit'

import { GameMode } from './game-mode'

export const gameModeSlice = createSlice({
  name: 'gameMode',
  initialState: GameMode.QUICKPLAY,
  reducers: {
    setGameMode(state, action) {
      return action.payload
    }
  }
})

export const { setGameMode } = gameModeSlice.actions
export const gameModeReducer = gameModeSlice.reducer
