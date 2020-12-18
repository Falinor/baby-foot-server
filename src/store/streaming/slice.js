import { createSlice } from '@reduxjs/toolkit'

export const streamingSlice = createSlice({
  name: 'streaming',
  initialState: {
    scene: null,
    timeout: 5,
    rotate: true
  },
  reducers: {
    setScene(state, action) {
      state.scene = action.payload
    },
    setRotation(state, action) {
      state.rotate = action.payload
    }
  }
})

export const { setScene, setRotation } = streamingSlice.actions
export const streamingReducer = streamingSlice.reducer
