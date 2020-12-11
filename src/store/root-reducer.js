import { combineReducers } from '@reduxjs/toolkit'

import { gameModeReducer } from './game-mode'
import { matchReducer } from './match'
import { statusReducer } from './status'

export const rootReducer = combineReducers({
  gameMode: gameModeReducer,
  match: matchReducer,
  status: statusReducer
})
