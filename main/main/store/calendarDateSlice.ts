import { createSlice } from '@reduxjs/toolkit'

export interface CalendarDateState {
  value: Date;
}

const initialState: CalendarDateState = {
  value: new Date(),
}

export const CalendarDateState = createSlice({
  name: 'calendarDate',
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.value = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setDate } = CalendarDateState.actions

export default CalendarDateState.reducer;