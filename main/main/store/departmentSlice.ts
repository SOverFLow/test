import { createSlice } from '@reduxjs/toolkit'

export interface DepartmentState {
  value: {
    uid: string;
    name: string;
    description: string;
  };
}

const initialState: DepartmentState = {
  value: {
    uid: '',
    name: '',
    description: '',
  },
}

export const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    setDepartmentUid: (state, action) => {
      state.value.uid = action.payload;
    },
    setDepartment: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setDepartment, setDepartmentUid } = departmentSlice.actions

export default departmentSlice.reducer;