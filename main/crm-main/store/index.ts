import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "./addressSlice";
import calendarDateSlice from "./calendarDateSlice";
import dateFilterSlice from "./dateFilterSlice";
import departmentSlice from "./departmentSlice";
import langSlice from "./langSlice";
import menuSlice from "./menuSlice";
import steperslice from "./steperslice";
import userSlice from "./userSlice";
import VerticalSteperSlice from "./VerticaleStepperSlice";
import loadingSlice from "./loadingSlice";

export const store = configureStore({
  reducer: {
    menuSlice,
    userSlice,
    langSlice,
    departmentSlice,
    steperslice,
    addressReducer,
    dateFilterSlice,
    calendarDateSlice,
    loadingSlice,
    VerticalSteperSlice,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
