import { combineReducers } from '@reduxjs/toolkit'

import { gameModeReducer } from './game-mode'
import { matchReducer } from './match'
import { statusReducer } from './status'
import { streamingReducer } from './streaming'

export const rootReducer = combineReducers({
  gameMode: gameModeReducer,
  match: matchReducer,
  status: statusReducer,
  streaming: streamingReducer
})
