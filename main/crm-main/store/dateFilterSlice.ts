import { createSlice } from '@reduxjs/toolkit'

export interface DateFilterState {
  value: Date;
}

const initialState: DateFilterState = {
  value: new Date(),
}

export const DateFilterSlice = createSlice({
  name: 'dateFilter',
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.value = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setDate } = DateFilterSlice.actions

export default DateFilterSlice.reducer;