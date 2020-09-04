import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: 'grid',
  initialState: {
    width: 15,
    height: 10,
  },
  reducers: {
    setDimensions(state, { payload }: {payload: {width: number, height: number}}) {
      state.width = payload.width;
      state.height = payload.height;
    }
  }
})

export default slice.reducer;
export const { setDimensions } = slice.actions;