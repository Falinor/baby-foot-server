import { createSlice } from '@reduxjs/toolkit'

import { Status } from './status'

export const statusSlice = createSlice({
  name: 'status',
  initialState: Status.FREE,
  reducers: {
    setStatus(state, action) {
      return action.payload
    }
  }
})

export const { setStatus } = statusSlice.actions
export const statusReducer = statusSlice.reducer
