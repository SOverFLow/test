import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface LoadingState {
  value: boolean
}

const initialState: LoadingState = {
  value: false,
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    open: (state) => {
      state.value = true
    },
    close: (state) => {
      state.value = false
    },
    toggle: (state) => {
      state.value = !state.value
    }
  },
})

// Action creators are generated for each case reducer function
export const { open, close, toggle } = loadingSlice.actions

export default loadingSlice.reducer;