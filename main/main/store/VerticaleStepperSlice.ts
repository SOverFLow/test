import { createSlice } from "@reduxjs/toolkit";

export interface StepeState {
    activeStep: number;
}

const initialState: StepeState = {
    activeStep: 0,
};


function VerticalSteperSlice(state: StepeState = initialState, action: any) {
    if (action.type === "VerticalSteperSlice/setActiveStep")
        return { ...state, activeStep: action.payload };
    return state;
}
export default VerticalSteperSlice;
