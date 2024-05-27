import { createSlice } from "@reduxjs/toolkit";

export interface StepeState {
  activeStep: number;
}

const initialState: StepeState = {
  activeStep: 0,
};

export const steperslice = createSlice({
  name: "steper",
  initialState,
  reducers: {
    nextStep: (state) => {
      state.activeStep += 1;
    },
    backStep: (state) => {
      state.activeStep -= 1;
    },
  },
});

export const { nextStep, backStep } = steperslice.actions;

export default steperslice.reducer;
