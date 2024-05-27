import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface LangState {
  value: string
}

const initialState: LangState = {
  value: 'en',
}

export const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLang: (state, action) => {
      state.value = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setLang } = langSlice.actions

export default langSlice.reducer;