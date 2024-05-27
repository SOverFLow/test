import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MenuState {
  value: boolean;
}

const initialState: MenuState = {
  value: false,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    open: (state) => {
      state.value = true;
      localStorage.setItem("menuState", JSON.stringify(true));
    },
    close: (state) => {
      state.value = false;
      localStorage.setItem("menuState", JSON.stringify(false));
    },
    toggle: (state) => {
      state.value = !state.value;
      localStorage.setItem("menuState", JSON.stringify(state.value));
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
      localStorage.setItem("menuState", JSON.stringify(action.payload));
    },
  },
});

// Action creators are generated for each case reducer function
export const { open, close, toggle, setOpen } = menuSlice.actions;

export default menuSlice.reducer;
